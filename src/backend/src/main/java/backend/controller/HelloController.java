package backend.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {


    @GetMapping("/api/HELLO!!")
    public String hello() {
        return "Hello from Parcel Marshall Backend!";
    }
}
