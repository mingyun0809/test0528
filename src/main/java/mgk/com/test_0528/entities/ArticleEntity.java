package mgk.com.test_0528.entities;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "index")
public class ArticleEntity {
    private int index;
    private String nickName;
    private String password;
    private String title;
    private String content;
    private int view;
    private LocalDateTime createdAt;
    private boolean isDeleted;
}
