package mgk.com.test_0528.controllers;

import mgk.com.test_0528.entities.ArticleEntity;
import mgk.com.test_0528.services.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
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

    @RequestMapping(value = "/modify", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getModify(@RequestParam(value = "index", required = false) Integer index, Model model) {
        if(index == null) {
            model.addAttribute("result", "failure");
            return "article/modify";
        }

        try {
            ArticleEntity article = articleService.selectArticleById(index);

            if(article != null && !article.isDeleted()) {
                model.addAttribute("article", article);
                model.addAttribute("result", "success");
            } else {
                model.addAttribute("result", "failure");
            }
        } catch (Exception e) {
            model.addAttribute("result", "failure");
        }

        return "article/modify";
    }

    @RequestMapping(value = "/board", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public String getBoard(@RequestParam(value = "page", defaultValue = "1") int page,
                           @RequestParam(value = "search", required = false) String search,
                           Model model) {
        try {
            Map<String, Object> boardData = articleService.getBoardList(page, search);

            model.addAttribute("articles", boardData.get("articles"));
            model.addAttribute("currentPage", boardData.get("currentPage"));
            model.addAttribute("totalPages", boardData.get("totalPages"));
            model.addAttribute("totalCount", boardData.get("totalCount"));
            model.addAttribute("currentSearch", boardData.get("currentSearch"));

        } catch (Exception e) {
            model.addAttribute("articles", new ArticleEntity[0]);
            model.addAttribute("currentPage", 1);
            model.addAttribute("totalPages", 0);
            model.addAttribute("totalCount", 0);
            model.addAttribute("currentSearch", search);
        }

        return "article/board";
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

    @RequestMapping(value = "/", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> patchArticle(
            @RequestParam("index") int index,
            @RequestParam("nickname") String nickname,
            @RequestParam("password") String password,
            @RequestParam("title") String title,
            @RequestParam("content") String content) {

        Map<String, Object> response = new HashMap<>();

        try {
            String result = articleService.updateArticle(index, nickname, password, title, content);
            response.put("result", result);
        } catch (Exception e) {
            response.put("result", "failure");
        }

        return ResponseEntity.ok(response);
    }
}