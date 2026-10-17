// Camada Service: concentra as regras de negócio dos autores.
package dw.editora.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import dw.editora.model.Artigo;
import dw.editora.model.Autor;
import dw.editora.repository.ArtigoRepository;
import dw.editora.repository.AutorRepository;

@Service
public class AutorService {

    private final AutorRepository autorRepository;
    private final ArtigoRepository artigoRepository;

    public AutorService(AutorRepository autorRepository, ArtigoRepository artigoRepository) {
        this.autorRepository = autorRepository;
        this.artigoRepository = artigoRepository;
    }

    // Regra: não podem existir dois autores com o mesmo email
    public Autor salvar(Autor autor) {
        if (autorRepository.existsByEmail(autor.getEmail()))
            throw new IllegalStateException("Já existe um autor com este email");
        return autorRepository.save(new Autor(autor.getNome(), autor.getEmail(), autor.getBiografia()));
    }

    public List<Autor> listarTodos() {
        return autorRepository.findAll();
    }

    public Optional<Autor> buscarPorId(long id) {
        return autorRepository.findById(id);
    }

    public List<Artigo> listarArtigosDoAutor(long idAutor) {
        return artigoRepository.findByAutorId(idAutor);
    }

    // Regra: não deixa apagar autor que ainda possui artigos.
    // Retorna false se o autor não existe.
    public boolean deletar(long id) {
        if (!autorRepository.existsById(id))
            return false;
        if (!artigoRepository.findByAutorId(id).isEmpty())
            throw new IllegalStateException("Autor possui artigos e não pode ser removido");
        autorRepository.deleteById(id);
        return true;
    }
}
