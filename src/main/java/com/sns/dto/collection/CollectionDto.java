package com.sns.dto.collection;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class CollectionDto {

    @Getter
    @Setter
    public static class CreateCollectionRequest {
        private Long userId;
        private String name;
        private String description;
        private String coverImageUrl;
        private Boolean isDefault;
    }

    @Getter
    @Setter
    public static class UpdateCollectionRequest {
        private String name;
        private String description;
        private String coverImageUrl;
        private Boolean isDefault;
    }

    @Getter
    @Builder
    public static class CollectionResponse {
        private Long id;
        private Long userId;
        private String name;
        private String description;
        private String coverImageUrl;
        private Boolean isDefault;
    }
}

