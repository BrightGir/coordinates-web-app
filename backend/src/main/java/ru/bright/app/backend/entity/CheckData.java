package ru.bright.app.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "results")
@Getter
@Setter
public class CheckData implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private double x;

    @Column(nullable = false)
    private double y;

    @Column(nullable = false)
    private double r;

    @Column(nullable = false)
    private boolean hit;

    @Column(nullable = false)
    private double executionTime;

    @Column(nullable = false)
    private Long clientTimestamp;

    @Column(nullable = false)
    private String clientTimeZone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    public CheckData() {

    }

    public String getFormattedTimestamp() {
        if (clientTimestamp != null && clientTimeZone != null) {
            try {
                Instant instant = Instant.ofEpochMilli(clientTimestamp);
                ZonedDateTime clientZoned = instant.atZone(ZoneId.of(clientTimeZone));
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
                return clientZoned.format(formatter);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return "";
    }

    public String getFormattedExecutionTime() {
        return String.format("%.4f", executionTime);
    }

    public String getFormattedX() {
        return String.format("%.3f", x);
    }

    public String getFormattedY() {
        return String.format("%.3f", y);
    }

    public String getFormattedR() {
        return String.format("%.3f", r);
    }
}
