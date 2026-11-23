
package dw.editora.control;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dw.editora.dto.ArtigoRequest;
import dw.editora.model.Artigo;
import dw.editora.model.Autor;
import dw.editora.repository.ArtigoRepository;
import dw.editora.repository.AutorRepository;

@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
@RestController
public class ArtigoController {

    private final ArtigoRepository rep;
    private final AutorRepository autorRep;

    public ArtigoController(ArtigoRepository rep, AutorRepository autorRep) {
        this.rep = rep;
        this.autorRep = autorRep;
    }

    @GetMapping("/")
    public ResponseEntity<List<Artigo>> getAllArtigos(@RequestParam(required = false) String titulo) {
        try {
            List<Artigo> la = new ArrayList<Artigo>();

            if (titulo == null)
                rep.findAll().forEach(la::add);
            else
                rep.findByTituloContainingIgnoreCase(titulo).forEach(la::add);

            if (la.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            return new ResponseEntity<>(la, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Artigo> getArtigo(@PathVariable("id") long id) {
        Optional<Artigo> data = rep.findById(id);

        if (data.isPresent()) {
            Artigo a = data.get();
            return new ResponseEntity<>(a, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/")
    public ResponseEntity<Artigo> createArtigo(@RequestBody ArtigoRequest ar) {
        try {
            if (ar.getAutorId() == null) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Optional<Autor> autorData = autorRep.findById(ar.getAutorId());

            if (autorData.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Artigo a = rep.save(new Artigo(
                    ar.getTitulo(),
                    ar.getResumo(),
                    ar.isPublicado(),
                    autorData.get()
            ));

            return new ResponseEntity<>(a, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artigo> updateArtigo(@PathVariable("id") long id, @RequestBody ArtigoRequest a) {
        Optional<Artigo> data = rep.findById(id);

        if (data.isPresent()) {
            Artigo ar = data.get();

            ar.setPublicado(a.isPublicado());
            ar.setResumo(a.getResumo());
            ar.setTitulo(a.getTitulo());

            if (a.getAutorId() != null) {
                Optional<Autor> autorData = autorRep.findById(a.getAutorId());

                if (autorData.isEmpty())
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);

                ar.setAutor(autorData.get());
            }

            return new ResponseEntity<>(rep.save(ar), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteArtigo(@PathVariable("id") long id) {
        try {
            rep.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/")
    public ResponseEntity<HttpStatus> deleteAllArtigo() {
        try {
            rep.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/publicado")
    public ResponseEntity<List<Artigo>> getAllPublicado() {
        try {
            List<Artigo> la = new ArrayList<Artigo>();
            rep.findByPublicado(true).forEach(la::add);

            if (la.isEmpty())
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);

            return new ResponseEntity<>(la, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
