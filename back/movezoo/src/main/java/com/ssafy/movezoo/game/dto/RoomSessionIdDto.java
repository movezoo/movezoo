    package com.ssafy.movezoo.game.dto;

    import lombok.Getter;
    import lombok.Setter;

    @Getter
    @Setter
    public class RoomSessionIdDto {
        private String roomSessionId;
        private String nickname;
        private int ranking;

        @Override
        public String toString() {
            return "RoomSessionIdDto{" +
                    "roomSessionId='" + roomSessionId + '\'' +
                    ", nickname='" + nickname + '\'' +
                    ", ranking=" + ranking +
                    '}';
        }
    }