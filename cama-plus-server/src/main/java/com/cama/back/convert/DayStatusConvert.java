package com.cama.back.convert;


//import com.cama.back.domain.account.DayStatus;
//
//import jakarta.persistence.AttributeConverter;
//import jakarta.persistence.Converter;
//import java.util.stream.Stream;
//
//
//@Converter(autoApply = true)
//public class DayStatusConvert implements AttributeConverter<DayStatus, String> {
//
//    @Override
//    public String convertToDatabaseColumn(DayStatus dayStatus) {
//        return dayStatus.getValue();
//    }
//
//    @Override
//    public DayStatus convertToEntityAttribute(String s) {
//        return Stream.of(DayStatus.values())
//                .filter(c -> c.getValue().equals(s))
//                .findFirst()
//                .orElseThrow(IllegalArgumentException::new);
//    }
//}
