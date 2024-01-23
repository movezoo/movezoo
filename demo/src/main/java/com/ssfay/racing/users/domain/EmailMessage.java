package com.ssfay.racing.users.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailMessage {

    private String target;
    private String title;
    private String message;
}