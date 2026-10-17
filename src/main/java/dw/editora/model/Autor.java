// Camada Model do padrão MVC.
package dw.editora.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "autor")
public class Autor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String nome;

    // unique = true garante que o banco rejeita dois autores com o mesmo email
    @Column(nullable = false, unique = true)
    private String email;

    // Texto longo/opcional: columnDefinition TEXT evita o limite padrão do
    // JPA (VARCHAR(255)); nullable=true (padrão) o deixa opcional
    @Column(columnDefinition = "TEXT")
    private String biografia;

    // Lado "um" do relacionamento 1:N. mappedBy = "autor" indica que quem tem
    // a coluna de chave estrangeira (autor_id) é a entidade Artigo.
    // @JsonIgnoreProperties("autor") evita o loop infinito no JSON.
    @OneToMany(mappedBy = "autor")
    @JsonIgnoreProperties("autor")
    private List<Artigo> artigos = new ArrayList<>();

    public Autor() {
    }

    public Autor(String nome, String email, String biografia) {
        this.nome = nome;
        this.email = email;
        this.biografia = biografia;
    }

    public long getId() { return this.id; }
    public void setId(long id) { this.id = id; }
    public String getNome() { return this.nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getBiografia() { return this.biografia; }
    public void setBiografia(String biografia) { this.biografia = biografia; }
    public List<Artigo> getArtigos() { return this.artigos; }
    public void setArtigos(List<Artigo> artigos) { this.artigos = artigos; }

    @Override
    public String toString() {
        return "Autor [id=" + id + ", nome=" + nome + ", email=" + email + "]";
    }
}
