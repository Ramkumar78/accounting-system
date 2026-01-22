package com.accounting.controller;

import com.accounting.model.Customer;
import com.accounting.model.Invoice;
import com.accounting.model.InvoiceItem;
import com.accounting.model.InvoiceStatus;
import com.accounting.service.AccountService;
import com.accounting.service.CurrencyService;
import com.accounting.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final AccountService accountService;
    private final CurrencyService currencyService;

    @GetMapping
    public ResponseEntity<List<Invoice>> listInvoices(@RequestParam(required = false) String status) {
        List<Invoice> invoices;
        if (status != null && !status.isEmpty()) {
            invoices = invoiceService.findByStatus(InvoiceStatus.valueOf(status));
        } else {
            invoices = invoiceService.findAll();
        }
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/form-data")
    public ResponseEntity<Map<String, Object>> getFormData() {
        return ResponseEntity.ok(Map.of(
            "statuses", InvoiceStatus.values(),
            "customers", invoiceService.findAllCustomers(),
            "currencies", currencyService.findAll(),
            "revenueAccounts", accountService.findActiveByType(com.accounting.model.AccountType.REVENUE)
        ));
    }

    @PostMapping("/save")
    public ResponseEntity<Invoice> saveInvoice(@RequestBody Invoice invoice) {
        Invoice savedInvoice;
        if (invoice.getId() == null) {
            savedInvoice = invoiceService.createInvoice(invoice);
        } else {
            savedInvoice = invoiceService.updateInvoice(invoice.getId(), invoice);
        }
        return ResponseEntity.ok(savedInvoice);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long id) {
        Invoice invoice = invoiceService.findByIdWithItems(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found: " + id));
        return ResponseEntity.ok(invoice);
    }

    @PostMapping("/send/{id}")
    public ResponseEntity<Void> sendInvoice(@PathVariable Long id) {
        invoiceService.sendInvoice(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/pay/{id}")
    public ResponseEntity<Void> markAsPaid(@PathVariable Long id,
                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate paymentDate) {
        invoiceService.markAsPaid(id, paymentDate);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<Void> cancelInvoice(@PathVariable Long id) {
        invoiceService.cancelInvoice(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> listCustomers() {
        return ResponseEntity.ok(invoiceService.findAllCustomers());
    }

    @GetMapping("/customers/form-data")
    public ResponseEntity<Map<String, Object>> getCustomerFormData() {
         return ResponseEntity.ok(Map.of(
             "arAccounts", accountService.findActiveByType(com.accounting.model.AccountType.ASSET)
         ));
    }

    @PostMapping("/customers/save")
    public ResponseEntity<Customer> saveCustomer(@RequestBody Customer customer) {
        return ResponseEntity.ok(invoiceService.saveCustomer(customer));
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable Long id) {
        Customer customer = invoiceService.findCustomerById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + id));
        return ResponseEntity.ok(customer);
    }
}