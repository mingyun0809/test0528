package mgk.com.test_0528.mappers;

import mgk.com.test_0528.entities.ArticleEntity;
import mgk.com.test_0528.vos.PageVo;
import mgk.com.test_0528.vos.SearchVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ArticleMapper {
    int update(@Param(value = "article")ArticleEntity article);

    int insert(@Param(value = "article")ArticleEntity article);

    int incrementView(@Param(value = "id") int id);

    int deleteArticle(@Param(value = "id") int id);

    ArticleEntity selectById(@Param(value = "id")int id);

    ArticleEntity[] selectAll(@Param(value = "pageVo") PageVo PageVo);

    ArticleEntity[] search(@Param(value = "pageVo")PageVo pageVo,
                           @Param(value = "searchVo") SearchVo searchVo);

    int countAll();

    int countSearch(@Param("searchVo") SearchVo searchVo);
}