package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.HashtagDm;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hashtags")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HashtagEntity {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "custom")
    private boolean custom;


    public HashtagDm toDm() {
        return HashtagDm.builder()
                .id(id)
                .name(name)
                .custom(custom)
                .build();
    }
}