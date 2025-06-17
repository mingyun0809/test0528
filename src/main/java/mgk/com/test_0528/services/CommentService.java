package mgk.com.test_0528.services;

import mgk.com.test_0528.entities.CommentEntity;
import mgk.com.test_0528.mappers.CommentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CommentService {
    private final CommentMapper commentMapper;

    @Autowired
    public CommentService(CommentMapper commentMapper) {
        this.commentMapper = commentMapper;
    }

    public boolean createComment(int articleIndex, String nickname, String content) {
        if(nickname == null || nickname.trim().isEmpty()) {
            return false;
        }

        if(content == null || content.trim().isEmpty()) {
            return false;
        }

        String trimmedNickname = nickname.trim();
        String trimmedContent = content.trim();

        if(trimmedNickname.length() > 10) {
            return false;
        }

        if(trimmedContent.length() > 100) {
            return false;
        }

        CommentEntity comment = CommentEntity.builder()
                .articleIndex(articleIndex)
                .nickname(trimmedNickname)
                .content(trimmedContent)
                .createdAt(LocalDateTime.now())
                .isDeleted(false)
                .build();
        int result = commentMapper.insert(comment);
        return result > 0;
    }

    public boolean deleteComment(int commentIndex) {
        CommentEntity comment = CommentEntity.builder()
                .index(commentIndex)
                .build();

        int result = commentMapper.update(comment);
        return result > 0;
    }

    public CommentEntity[] getCommentsByArticleIndex(int articleIndex) {
        return commentMapper.selectAllByArticleIndex(articleIndex);
    }
}
