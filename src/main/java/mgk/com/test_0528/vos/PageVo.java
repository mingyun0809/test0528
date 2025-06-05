package mgk.com.test_0528.vos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageVo {

    private int page = 1;
    private int size = 5;
    private int offset;

    public PageVo(int page, int size) {
        this.page = page;
        this.size = size;
        this.offset = (page - 1) * size;
    }


}
