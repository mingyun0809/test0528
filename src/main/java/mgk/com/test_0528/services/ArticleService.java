package mgk.com.test_0528.services;

import mgk.com.test_0528.entities.ArticleEntity;
import mgk.com.test_0528.mappers.ArticleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ArticleService {

    private final ArticleMapper articleMapper;

    @Autowired
    public ArticleService(ArticleMapper articleMapper) {
        this.articleMapper = articleMapper;
    }


    public ArticleEntity getArticleByIndex(int index) {
        ArticleEntity article = articleMapper.selectById(index);

        if (article == null || article.isDeleted()) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다.");
        }


        articleMapper.incrementView(index);
        article.setView(article.getView() + 1);

        return article;
    }

    public int createArticle(String nickname, String password, String title, String content) {
        if (nickname == null || nickname.trim().isEmpty()) {
            throw new IllegalArgumentException("닉네임을 입력해주세요.");
        }

        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호를 입력해주세요.");
        }

        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("제목을 입력해주세요.");
        }

        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("내용을 입력해주세요.");
        }

        String trimmedNickname = nickname.trim();
        String trimmedPassword = password.trim();
        String trimmedTitle = title.trim();
        String trimmedContent = content.trim();

        ArticleEntity article = ArticleEntity.builder()
                .nickName(trimmedNickname)
                .password(trimmedPassword)
                .title(trimmedTitle)
                .content(trimmedContent)
                .view(0)
                .createdAt(LocalDateTime.now())
                .isDeleted(false)
                .build();

        int result = articleMapper.insert(article);

        if (result > 0) {
            return article.getIndex();
        }

        throw new RuntimeException("게시글 작성에 실패했습니다.");
    }

    public boolean deleteArticle(int index, String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호를 입력해주세요.");
        }

        String trimmedPassword = password.trim();

        if (trimmedPassword.length() < 4 || trimmedPassword.length() > 25) {
            throw new IllegalArgumentException("비밀번호는 4자 이상 25자 미만으로 입력해주세요.");
        }

        ArticleEntity article = articleMapper.selectById(index);

        if (article == null) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다.");
        }

        if (article.isDeleted()) {
            throw new IllegalArgumentException("이미 삭제된 게시글입니다.");
        }

        if (!article.getPassword().equals(trimmedPassword)) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        int result = articleMapper.update(index);

        return result > 0;
    }

    public ArticleEntity selectArticleById(int index) {
        return articleMapper.selectById(index);
    }

    public void incrementView(int index) {
        articleMapper.incrementView(index);
    }

    public int insertArticle(ArticleEntity article) {
        return articleMapper.insert(article);
    }
}