package com.mathverse.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mathverse.user.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
