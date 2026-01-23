package com.accounting.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AccountingException.class)
    public Object handleAccountingException(AccountingException ex,
                                            HttpServletRequest request,
                                            RedirectAttributes redirectAttributes) {
        if (isApiRequest(request)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request", "message", ex.getMessage()));
        }
        redirectAttributes.addFlashAttribute("errorMessage", ex.getMessage());

        String referer = request.getHeader("Referer");
        if (referer != null && !referer.isEmpty()) {
            return "redirect:" + referer;
        }
        return "redirect:/dashboard";
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Object handleGenericException(Exception ex, Model model, HttpServletRequest request) {
        if (isApiRequest(request)) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                 .body(Map.of("error", "Internal Server Error", "message", ex.getMessage() != null ? ex.getMessage() : "Unknown error"));
        }
        model.addAttribute("errorMessage", "An unexpected error occurred: " + ex.getMessage());
        model.addAttribute("exception", ex);
        return "error/500";
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public Object handleIllegalArgumentException(IllegalArgumentException ex,
                                                 RedirectAttributes redirectAttributes,
                                                 HttpServletRequest request) {
        if (isApiRequest(request)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid Input", "message", ex.getMessage()));
        }
        redirectAttributes.addFlashAttribute("errorMessage", "Invalid input: " + ex.getMessage());

        String referer = request.getHeader("Referer");
        if (referer != null && !referer.isEmpty()) {
            return "redirect:" + referer;
        }
        return "redirect:/dashboard";
    }

    private boolean isApiRequest(HttpServletRequest request) {
        String accept = request.getHeader("Accept");
        if (accept != null && accept.contains("application/json")) {
            return true;
        }
        String uri = request.getRequestURI();
        return uri.startsWith("/api/");
    }
}
