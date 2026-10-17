package dw.editora.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import dw.editora.model.Autor;

public interface AutorRepository extends JpaRepository<Autor, Long> {

    // O Spring gera: SELECT COUNT(*) > 0 FROM autor WHERE email = ?
    boolean existsByEmail(String email);
}
