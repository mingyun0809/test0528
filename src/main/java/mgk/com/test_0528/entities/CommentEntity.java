package mgk.com.test_0528.entities;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "index")
public class CommentEntity {
    private int index;
    private int articleIndex;
    private String nickname;
    private String content;
    private LocalDateTime createdAt;
    private Boolean isDeleted;
}
