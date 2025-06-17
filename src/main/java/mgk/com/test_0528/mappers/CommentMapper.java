package mgk.com.test_0528.mappers;

import mgk.com.test_0528.entities.CommentEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CommentMapper {
    int update(@Param(value = "comment")CommentEntity comment);
    int insert(@Param(value = "comment")CommentEntity comment);
    CommentEntity[] selectAllByArticleIndex(@Param(value = "articleIndex") int articleIndex);

}
