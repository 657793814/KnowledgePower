package com.mathverse.common.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // 通用
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未登录"),
    FORBIDDEN(403, "无权限"),
    NOT_FOUND(404, "资源不存在"),
    INTERNAL_ERROR(500, "系统内部错误"),

    // 业务
    NODE_NOT_FOUND(1001, "知识点不存在"),
    NODE_ID_EXISTS(1002, "知识点编码已存在"),
    RELATION_NOT_FOUND(1010, "关系不存在"),
    INVALID_RELATION(1011, "无效的知识点关系");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
