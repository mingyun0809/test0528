package mgk.com.test_0528.controllers;

import mgk.com.test_0528.entities.ArticleEntity;
import mgk.com.test_0528.services.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping(value = "/article")
public class ArticleController {

    private final ArticleService articleService;

    @Autowired
    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @RequestMapping(value = "/write", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getWrite() {
        return "article/write";
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getRead(@RequestParam(value = "index", required = false) Integer index, Model model) {
        if (index == null) {
            return "article/read";
        }

        try {
            ArticleEntity article = articleService.getArticleByIndex(index);
            model.addAttribute("article", article);
            model.addAttribute("result", "success");
        } catch (Exception e) {
            model.addAttribute("result", "failure");
        }

        return "article/read";
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> postArticle(
            @RequestParam("nickname") String nickname,
            @RequestParam("password") String password,
            @RequestParam("title") String title,
            @RequestParam(value = "content") String content) {

        Map<String, Object> response = new HashMap<>();

        try {

            int articleIndex = articleService.createArticle(nickname, password, title, content);

            response.put("result", "success");
            response.put("index", articleIndex);
        } catch (IllegalArgumentException e) {
            response.put("result", "failure");
            response.put("message", e.getMessage());
        } catch (Exception e) {
            response.put("result", "failure");
            response.put("message", "서버 오류가 발생했습니다.");
        }

        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> deleteArticle(@RequestParam("index") int index,
                                                             @RequestParam("password") String password) {
        Map<String,Object> response = new HashMap<>();

        try {

            boolean deleteResult = articleService.deleteArticle(index, password);

            if(deleteResult) {
                response.put("result", "success");
            } else {
                response.put("result", "failure");
                response.put("message", "게시글 삭제에 실패했습니다.");
            }
        } catch (IllegalArgumentException e) {
            response.put("result", "failure");
            response.put("message", e.getMessage());
        } catch (Exception e) {
            response.put("result", "failure");
            response.put("message", "서버 오류가 발생했습니다.");
        }

        return ResponseEntity.ok(response);
    }
}