package com.businessflow.dto;

import java.util.List;

public record UserProfileResponse(String username, List<String> roles) {
}
