package mgk.com.test_0528.mappers;

import mgk.com.test_0528.entities.ArticleEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ArticleMapper {

    ArticleEntity selectById(@Param("index") int index);

    int insert(ArticleEntity article);

    int incrementView(@Param("index") int index);

    int update(@Param("index") int index);

    int deleteArticle(@Param("index") int index);
}