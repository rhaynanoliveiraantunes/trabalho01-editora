package dw.editora.dto;

public class ArtigoRequest {

    private String titulo;
    private String resumo;
    private boolean publicado;
    private Long autorId;

    public ArtigoRequest() {
    }

    public ArtigoRequest(String titulo, String resumo, boolean publicado, Long autorId) {
        this.titulo = titulo;
        this.resumo = resumo;
        this.publicado = publicado;
        this.autorId = autorId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getResumo() {
        return resumo;
    }

    public void setResumo(String resumo) {
        this.resumo = resumo;
    }

    public boolean isPublicado() {
        return publicado;
    }

    public void setPublicado(boolean publicado) {
        this.publicado = publicado;
    }

    public Long getAutorId() {
        return autorId;
    }

    public void setAutorId(Long autorId) {
        this.autorId = autorId;
    }
}
