package com.ssafy.movezoo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingRequestDto {
    private int userId;
    private int volume;
    private int mic;
    private int cameraSensitivity;
}
