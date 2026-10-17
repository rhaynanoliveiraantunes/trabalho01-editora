// Camada Controller do padrão MVC.
package dw.editora.control;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dw.editora.model.Artigo;
import dw.editora.model.Autor;
import dw.editora.service.AutorService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/autores")
public class AutorController {

    private final AutorService service;

    public AutorController(AutorService service) {
        this.service = service;
    }

    // POST /api/autores : cadastrar autor
    @PostMapping
    public ResponseEntity<Autor> createAutor(@RequestBody Autor autor) {
        if (autor.getNome() == null || autor.getNome().isBlank()
                || autor.getEmail() == null || autor.getEmail().isBlank())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // 400: nome e email obrigatórios
        try {
            return new ResponseEntity<>(service.salvar(autor), HttpStatus.CREATED); // 201
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); // 409: email repetido
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET /api/autores : listar todos os autores
    @GetMapping
    public ResponseEntity<List<Autor>> getAllAutores() {
        return new ResponseEntity<>(service.listarTodos(), HttpStatus.OK);
    }

    // GET /api/autores/{id} : buscar autor por id
    @GetMapping("/{id}")
    public ResponseEntity<Autor> getAutor(@PathVariable("id") long id) {
        Optional<Autor> data = service.buscarPorId(id);
        if (data.isPresent())
            return new ResponseEntity<>(data.get(), HttpStatus.OK);
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // GET /api/autores/{id}/artigos : artigos publicados por um autor
    @GetMapping("/{id}/artigos")
    public ResponseEntity<List<Artigo>> getArtigosDoAutor(@PathVariable("id") long id) {
        if (service.buscarPorId(id).isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(service.listarArtigosDoAutor(id), HttpStatus.OK);
    }

    // DELETE /api/autores/{id} : remover autor
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteAutor(@PathVariable("id") long id) {
        try {
            if (!service.deletar(id))
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(HttpStatus.CONFLICT); // 409: autor tem artigos
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
