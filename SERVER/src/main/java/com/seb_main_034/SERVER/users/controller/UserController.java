package com.seb_main_034.SERVER.users.controller;


import com.seb_main_034.SERVER.users.dto.PasswordDto;
import com.seb_main_034.SERVER.users.dto.UserPatchDto;
import com.seb_main_034.SERVER.users.dto.UserResponseDto;
import com.seb_main_034.SERVER.users.dto.UserSaveDto;
import com.seb_main_034.SERVER.users.entity.Users;
import com.seb_main_034.SERVER.users.mapper.PatchMapper;
import com.seb_main_034.SERVER.users.mapper.UserMapper;
import com.seb_main_034.SERVER.users.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import javax.validation.constraints.Positive;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;
    private final UserMapper mapper;
    private final PatchMapper patchMapper;

    @GetMapping("/info/{userId}") // 회원조회
    public ResponseEntity info(@PathVariable @Positive Long userId) {
        log.info("Controller 호출 -> 회원조회");
        Users findUser = service.findById(userId);

        return new ResponseEntity<>(createResponseDto(findUser), HttpStatus.OK);
    }

    @GetMapping("/info/all")
    public ResponseEntity allUsers() {
        log.info("Controller 호출 -> 모든 유저목록 조회");
        List<Users> usersList = service.findAllUsers();
        return new ResponseEntity<>(usersList, HttpStatus.OK);
    }

    @PostMapping("/register") // 회원가입
    public ResponseEntity signUp(@Valid @RequestBody UserSaveDto userSaveDto) {

        log.info("Controller 호출 -> 회원가입");
        log.info("가입정보 -> 이메일 = {}", userSaveDto.getEmail());

        Users savedUser = service.save(mapper.UserSaveDTOtoUser(userSaveDto));

        log.info("가입된 회원의 번호 = {}", savedUser.getUserId());

        return new ResponseEntity<>(createResponseDto(savedUser), HttpStatus.CREATED);
    }

    @PatchMapping("/update/{userId}") // 회원정보 수정 가입할 때 사진을 등록하지 않아도, 여기서 등록할 수 있음 비어있는걸 보내면 사용중이던 것 그대로 사용
    public ResponseEntity update(@PathVariable @Positive Long userId,
                                 @Valid @RequestBody UserPatchDto userPatchDto) {
        log.info("Controller 호출 -> 회원정보 수정");
        log.info("수정정보 -> 닉네임 = {}, 프로필사진 = {}",
                userPatchDto.getNickName(), userPatchDto.getProFilePicture());

        Users updatedUser = service.update(userId, userPatchDto);

        return new ResponseEntity<>(createResponseDto(updatedUser), HttpStatus.OK);

    }

    @PatchMapping("/password/{userId}") // 비밀번호 변경. 임시로 작성. 후에 로그인 되어있는지 확인하는 코드와 로그아웃 시키는 코드가 필요할듯?
    public String updatePassword(@PathVariable Long userId,
                                 @Valid @RequestBody PasswordDto passwordDto) {
        log.info("Controller 호출 -> 비밀번호 수정");

        service.changePw(userId, passwordDto);

        return "비밀번호 변경 완료!";
    }

    @DeleteMapping("/delete/{userId}") // 회원탈퇴
    public ResponseEntity delete(@PathVariable @Positive Long userId) {
        log.info("Controller 호출 -> 회원탈퇴");

        Users findUser = service.findById(userId);
        service.delete(findUser);

        return new ResponseEntity("삭제 완료", HttpStatus.OK);
    }

//    @DeleteMapping("/delete/all") // 테스트용 모두 삭제
//    public ResponseEntity deleteAll() {
//        log.info("Controller 호출 -> 전부 삭제");
//
//        service.deleteAll();
//        return new ResponseEntity("전부삭제 완료", HttpStatus.OK);
//    }
    
    private UserResponseDto createResponseDto(Users user) {
        return mapper.UsertoUserResponseDto(user);
    }
}
