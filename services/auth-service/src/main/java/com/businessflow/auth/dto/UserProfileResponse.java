package com.businessflow.auth.dto;

import java.util.List;

public record UserProfileResponse(String username, List<String> roles) {
}
