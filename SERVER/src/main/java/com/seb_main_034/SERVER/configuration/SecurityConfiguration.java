package com.seb_main_034.SERVER.configuration;

import com.seb_main_034.SERVER.auth.filter.JwtAuthenticationFilter;
import com.seb_main_034.SERVER.auth.filter.JwtVerificationFilter;
import com.seb_main_034.SERVER.auth.handler.*;
import com.seb_main_034.SERVER.auth.jwt.JwtTokenizer;
import com.seb_main_034.SERVER.auth.userdetails.UsersDetailsService;
import com.seb_main_034.SERVER.auth.utils.UsersAuthorityUtils;
import com.seb_main_034.SERVER.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity(debug = true)
public class SecurityConfiguration {

    private final JwtTokenizer jwtTokenizer;
    private final UsersAuthorityUtils authorityUtils;
    private final UsersDetailsService usersDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.headers().frameOptions().sameOrigin()
                .and()
                .csrf().disable()
                .cors(withDefaults()) // 아래의 CorsConfigurationSource를 필터에 적용
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 세션을 생성X, SecurityContext 정보를 얻기 위해 절대 세션을 사용X
                .and()
                .formLogin().disable() // CSR 방식으로 만들기 때문에 SSR 방식에서 사용하는 폼 로그인 비활성화.
                .httpBasic().disable() // Request를 전송할 때마다 ID,PASSWORD를 헤더에 실어서 인증하는 방식을 비활성화
                .exceptionHandling()
                .authenticationEntryPoint(new UserAuthenticationEntryPoint())
                .accessDeniedHandler(new UserAccessDeniedHandler())
                .and()
                .apply(new CustomFilterConfigurer())
                .and()
                .authorizeHttpRequests(authorize ->authorize
                        .antMatchers(HttpMethod.POST, "/api/users/**").permitAll() // 비회원은 회원가입, 로그인, OAuth2로그인에 접근가능
                        .antMatchers(HttpMethod.PATCH, "/api/users/update/**").hasAnyRole("USER", "ADMIN") // 회원과 관리자는 회원정보 수정에 접근가능
                        .antMatchers(HttpMethod.PATCH, "/api/users/password/**").hasRole("USER") // 회원만 비밀번호 변경가능
                        .antMatchers(HttpMethod.DELETE, "/api/users/delete/**").hasRole("USER")
                        .antMatchers(HttpMethod.GET, "/api/users/info/**").hasAnyRole("USER", "ADMIN") // 관리자와 회원은 회원정보를 열람할 수 있음
                        .antMatchers(HttpMethod.GET,"/api/users/info/all").hasRole("ADMIN") // 관리자는 모든회원 목록을 열람할 수 있음
                        .antMatchers(HttpMethod.POST, "/api/ratings").hasRole("USER")
                        .antMatchers(HttpMethod.GET, "/api/movies/all").permitAll() // 비회원은 영회목록조회만 가능 태그가붙으면 주소가 바뀌는지 생각해봐야 함
                        .antMatchers(HttpMethod.POST, "/api/movies").hasRole("ADMIN") // 영화 등록은 관리자만 가능
                        .antMatchers(HttpMethod.PATCH, "/api/movies/**").hasRole("ADMIN") // 영화수정은 관리자만 가능
                        .antMatchers(HttpMethod.DELETE, "/api/movies/**").hasRole("ADMIN") // 영화삭제는 관리자만 가능
                        .antMatchers(HttpMethod.GET, "/api/movies/**").hasAnyRole("USER", "ADMIN") // 회원이면 영화감상 가능
                        .antMatchers(HttpMethod.GET, "/api/movies/recommendations/user/**").hasRole("USER")
                        .antMatchers(HttpMethod.GET, "/api/movies/recommendations/top-rated").permitAll() //누구나 상위 평점 4점이상 영화목록을 조회 가능
                        .antMatchers(HttpMethod.GET, "/api/movies/search/**").permitAll() // 누구나 영화 검색은 가능
                        .antMatchers(HttpMethod.POST, "/api/comment/**").hasAnyRole("USER", "ADMIN") // 댓글은 비회원은 작성불가
                        .antMatchers(HttpMethod.PATCH, "/api/comment/**").hasRole("USER") // 댓글수정은 회원만 가능
                        .antMatchers(HttpMethod.DELETE, "/api/comment/**").hasAnyRole("USER", "ADMIN") // 댓글삭제는 비회원만 불가능
                        .antMatchers("/api/**").permitAll()); // 제한이 걸리지 않은 기능은 모두 사용가능
//                        .oauth2Login(oauth2 -> oauth2.successHandler(
//                                new OAuth2SuccessHandler(jwtTokenizer, authorityUtils, userService)));

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:8080", "http://034pro.s3-website.ap-northeast-2.amazonaws.com"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.addAllowedHeader("*");
        configuration.addExposedHeader("*");
        configuration.setMaxAge(3000L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); // CorsConfigurationSource의 구현클래스 객체 생성
        source.registerCorsConfiguration("/**", configuration); // 모든 url에 위에서 설정한 cors 설정 적용
        return source;
    }

    //JwtAuthenticationFilter를 등록하는 역할 이 추상 클래스를 상속해야 가능함
    public class CustomFilterConfigurer extends AbstractHttpConfigurer<CustomFilterConfigurer, HttpSecurity> {
        @Override
        public void configure(HttpSecurity builder) throws Exception {

            //AuthenticationManager의 객체를 얻어옴             이 메서드를 통해 SecurityConfigurer 간에 공유되는 객체를 얻음
            AuthenticationManager authenticationManager = builder.getSharedObject(AuthenticationManager.class);

            //JwtAuthenticationFilter 에 필요한 authenticationManager와 jwtTokenizer를 DI
            JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(authenticationManager, jwtTokenizer);
            jwtAuthenticationFilter.setFilterProcessesUrl("/api/users/login");

            //성공시 이 핸들러의 호출을 설정
            jwtAuthenticationFilter.setAuthenticationSuccessHandler(new UserAuthenticationSuccessHandler());
            jwtAuthenticationFilter.setAuthenticationFailureHandler(new UserAuthenticationFailureHandler());

            //자격 증명 및 검증을 하는 객채 생성
            JwtVerificationFilter jwtVerificationFilter = new JwtVerificationFilter(jwtTokenizer, authorityUtils, usersDetailsService);


            builder.addFilter(jwtAuthenticationFilter)
                    .addFilterAfter(jwtVerificationFilter, JwtAuthenticationFilter.class); // 시큐리티 필터체인에 인증 -> 자격검증 순으로 추가
//                    .addFilterAfter(jwtVerificationFilter, OAuth2LoginAuthenticationFilter.class); // 소셜로그인쪽 코드. 불완전.
        }
    }
}
