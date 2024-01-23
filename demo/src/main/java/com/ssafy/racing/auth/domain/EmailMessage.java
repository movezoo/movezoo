package com.ssafy.racing.auth.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class EmailMessage {

    private String target;
    private String title;
    private String message;
}