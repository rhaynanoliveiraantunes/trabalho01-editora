package dw.editora.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import dw.editora.model.Autor;

public interface AutorRepository extends JpaRepository<Autor, Long> {

    boolean existsByEmail(String email);
}
