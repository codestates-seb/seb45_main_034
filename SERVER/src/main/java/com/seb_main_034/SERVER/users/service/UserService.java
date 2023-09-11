package com.seb_main_034.SERVER.users.service;

import com.seb_main_034.SERVER.auth.utils.UsersAuthorityUtils;
import com.seb_main_034.SERVER.exception.ExceptionCode;
import com.seb_main_034.SERVER.exception.UserException;
import com.seb_main_034.SERVER.users.dto.PasswordDto;
import com.seb_main_034.SERVER.users.dto.UserPatchDto;
import com.seb_main_034.SERVER.users.entity.Users;
import com.seb_main_034.SERVER.users.mapper.PatchMapper;
import com.seb_main_034.SERVER.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository repository;
    private final PatchMapper patchMapper;
    private final PasswordEncoder encoder;
    private final UsersAuthorityUtils authorityUtils; // 권한 설정을 위한 클래스

    public Users save(Users user) {
        log.info("Service 호출 -> 저장");
        if (checkEmail(user.getEmail(), user.getNickName())) { // 이미 서버에 존재하는 이메일인지 확인
            user.setPassword(encoder.encode(user.getPassword())); // 비밀번호 암호화
            List<String> roles = authorityUtils.createRoles(user.getEmail()); // 권한 설정
            user.setRoles(roles);
            return repository.save(user);
        }
        return null;
    }

    public Users OAuth2Save(Users user) {
        log.info("Service 호출 -> OAuth2 저장");
        return repository.save(user);
    }

    public Users update(Long userId, UserPatchDto userPatchDto) {
        log.info("Service 호출 -> 업데이트");
        Users findUser = findById(userId);
        if (repository.findBynickName(userPatchDto.getNickName()).isPresent()) {
            throw new UserException(ExceptionCode.NICKNAME_EXISTS);
        }
        return repository.save(patchMapper.UserPatchDTOtoUser(findUser,userPatchDto));
    }

    public void delete(Users user) {
        log.info("Service 호출 -> 삭제");
        repository.delete(user);
    }

    public void changePw(Long userId, PasswordDto passwordDto) {
        log.info("Service 호출 -> 비밀번호 변경");
        Users findUser = findById(userId);
        String encodePw = encoder.encode(passwordDto.getPassword());// 바꾸길 원하는 비밀번호 암호화 및 재설정
        findUser.setPassword(encodePw);
        repository.save(findUser);
    }


    /**
     * 관리자 계정은 다른 테이블을 하나 만들어서 그곳에서 관리하는것이 더 낫지 않을까?
     * 모든 유저조회를 만들다보니 이 목록에 관리자 계정은 들어있으면..
     * 일단은 목록에서 제외하고 반환하는걸로 작성함.
     */
    public List<Users> findAllUsers() {
        log.info("findAllUsers 호출");
        List<Users> tmpList = repository.findAll();
        List<Users> usersList = deleteAdmin(tmpList);

        return usersList;
    }

    public Users findById(Long userId) {
        log.info("findById 호출");
        return repository.findById(userId).orElseThrow(() -> new UserException(ExceptionCode.USER_NOT_FOUND));
    }

    public Users findByEmail(String email) {
        log.info("이메일로 유저조회");
        Users findUser = repository.findByEmail(email).orElseThrow(
                () -> new UserException(ExceptionCode.USER_NOT_FOUND));

        return findUser;
    }

    /**
     * 회원가입시, 이메일과 닉네임의 중복을 체크하는 메서드.
     * 단, 닉네임이 null로 같아도 에러가나는데, 이 부분 수정 필요.
     */
    public boolean checkEmail(String email, String nickName) {
        log.info("이메일과 닉네임 체크");

        if (repository.findByEmail(email).isPresent()) {
            log.error("이미 존재하는 회원입니다.");
            throw new UserException(ExceptionCode.USER_EXISTS);
        }

        if (repository.findBynickName(nickName).isPresent()) {
            log.error("이미 존재하는 닉네임입니다.");
            throw new UserException(ExceptionCode.NICKNAME_EXISTS);
        }
        return true;
    }

    public void deleteAll() {
        log.info("Service 호출 -> 전부 삭제");
        repository.deleteAll();
    }

    public List<Users> deleteAdmin(List<Users> usersList) {
        log.info("관리자 계정은 모든 회원목록에서 보이지 않아야함");
        return usersList.stream().filter(user -> user.getRoles().size() == 1) // 회원은 권한을 오직 1개만 갖고있음
                                 .collect(Collectors.toList());
    }

}
