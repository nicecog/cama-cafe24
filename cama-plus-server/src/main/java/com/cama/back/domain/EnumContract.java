package com.cama.back.domain;

import com.cama.back.domain.api.EnumModel;

public class EnumContract {

    // 지불방식
    public enum PayType implements EnumModel {

        PAY_1("인수증"),
        PAY_2("카드"),
        PAY_3("인수증+카드");

        private String value;

        PayType(String value) {
            this.value = value;
        }

        @Override
        public String getKey() {
            return name();
        }

        @Override
        public String getValue() {
            return value;
        }
    }

    public enum CarType implements EnumModel {

        CAR_1("1톤"),
        CAR_2("1.2톤"),
        CAR_3("2.5톤"),
        CAR_4("3.5톤(광폭)"),
        CAR_5("3.5톤(준광폭)"),
        CAR_6("4.5톤"),
        CAR_7("5톤"),
        CAR_8("5톤축");

        private String value;

        CarType(String value) {
            this.value = value;
        }

        @Override
        public String getKey() {
            return name();
        }

        @Override
        public String getValue() {
            return value;
        }
    }

    public enum TruckInfo implements EnumModel {

        T_1("빠렛트");

        private String value;

        TruckInfo(String value) {
            this.value = value;
        }

        @Override
        public String getKey() {
            return name();
        }

        @Override
        public String getValue() {
            return value;
        }
    }

    public enum UpTime implements EnumModel {

        UP_1("당상"),
        UP_2("낼상");

        private String value;

        UpTime(String value) {
            this.value = value;
        }

        @Override
        public String getKey() {
            return name();
        }

        @Override
        public String getValue() {
            return value;
        }
    }

    public enum UpType implements EnumModel {

        UT_1("수작업"),
        UT_2("지게차");

        private String value;

        UpType(String value) {
            this.value = value;
        }

        @Override
        public String getKey() {
            return name();
        }

        @Override
        public String getValue() {
            return value;
        }
    }

    public enum DownTime implements EnumModel {

        DW_1("당상"),
        DW_2("낼상");

        private String value;

        DownTime(String value) {
            this.value = value;
        }

        @Override
        public String getKey() {
            return name();
        }

        @Override
        public String getValue() {
            return value;
        }
    }

    public enum DownType implements EnumModel {

        DT_1("수작업"),
        DT_2("지게차");

        private String value;

        DownType(String value) {
            this.value = value;
        }

        @Override
        public String getKey() {
            return name();
        }

        @Override
        public String getValue() {
            return value;
        }
    }

    public enum Temperature implements EnumModel {

        TE_1("냉동");

        private String value;

        Temperature(String value) {
            this.value = value;
        }

        @Override
        public String getKey() {
            return name();
        }

        @Override
        public String getValue() {
            return value;
        }
    }

}
