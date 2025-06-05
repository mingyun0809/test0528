package mgk.com.test_0528.vos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchVo {
    private String keyword;

    public SearchVo(String keyword) {
        this.keyword = keyword;
    }
}
