package mgk.com.test_0528.mappers;

import mgk.com.test_0528.entities.ArticleEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ArticleMapper {
    int update(@Param(value = "article")ArticleEntity article);

    int insert(@Param(value = "article")ArticleEntity article);

    int incrementView(@Param(value = "id") int id);

    int deleteArticle(@Param(value = "id") ArticleEntity article);

    ArticleEntity selectById(@Param(value = "id")int id);
}