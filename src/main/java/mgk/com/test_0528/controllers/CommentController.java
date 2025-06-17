package mgk.com.test_0528.controllers;

import mgk.com.test_0528.entities.CommentEntity;
import mgk.com.test_0528.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping(value = "/comment")
public class CommentController {
    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<CommentEntity[]> getComments(@RequestParam("articleIndex") int articleIndex) {
        try {
            CommentEntity[] comments = commentService.getCommentsByArticleIndex(articleIndex);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.ok(new CommentEntity[0]);
        }
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> postComment(
            @RequestParam("articleIndex") int articleIndex,
            @RequestParam("nickname") String nickname,
            @RequestParam("content") String content) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean result = commentService.createComment(articleIndex, nickname, content);

            if(result) {
                response.put("result", "success");
            } else {
                response.put("result", "failure");
            }
        } catch (Exception e) {
            response.put("result", "failure");
        }

        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> deleteComment(@RequestParam("index") int index) {

        Map<String, Object> response = new HashMap<>();

        try {
            boolean result = commentService.deleteComment(index);

            if (result) {
                response.put("result", "success");
            } else {
                response.put("result", "failure");
            }
        } catch (Exception e) {
            response.put("result", "failure");
        }

        return ResponseEntity.ok(response);
    }
}














