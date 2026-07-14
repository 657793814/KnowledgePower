package com.mathverse.user.controller;

import com.mathverse.common.result.R;
import com.mathverse.user.entity.User;
import com.mathverse.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "用户管理")
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "获取当前用户信息（简化）")
    @GetMapping("/info")
    public R<User> info() {
        // Phase 1 返回第一个用户，后续接入认证
        User user = userService.getById(1L);
        if (user != null) {
            user.setPassword(null);
        }
        return R.ok(user);
    }
}
