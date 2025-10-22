package ru.bright.app.backend.dto;

import lombok.Getter;
import lombok.Setter;
import ru.bright.app.backend.entity.CheckData;

@Getter
@Setter
public class ResultResponseDTO {
    private Long id;
    private String x;
    private String y;
    private String r;
    private boolean hit;
    private String formattedTimestamp;
    private String formattedExecutionTime;
    
    public ResultResponseDTO(CheckData checkData) {
        this.id = checkData.getId();
        this.x = checkData.getFormattedX();
        this.y = checkData.getFormattedY();
        this.r = checkData.getFormattedR();
        this.hit = checkData.isHit();
        this.formattedTimestamp = checkData.getFormattedTimestamp();
        this.formattedExecutionTime = checkData.getFormattedExecutionTime();
    }
}
