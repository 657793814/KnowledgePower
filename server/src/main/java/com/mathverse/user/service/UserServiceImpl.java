package com.mathverse.user.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mathverse.user.entity.User;
import com.mathverse.user.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
}
