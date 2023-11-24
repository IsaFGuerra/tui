async function relatorioEstornosPDF() {
    const perfil = await new Promise((resolve) => {
        leitor.question(`qual seu perfil?`, (answer) => resolve(answer));
    });

    const start = await new Promise((start) => {
        leitor.question(`a partir de qual data deseja ver os reembolsos?`, (answer) => {
            start(answer);
        });
    });

    const end = await new Promise((end) => {
        leitor.question(`a partir de qual data deseja ver os reembolsos?`, (answer) => {
            end(answer);
        });

    });

    const dates = {
        start,
        end
    }
    
    try{
        const { data } = await axios.post(`http://localhost:8080/list/refunds/${pefil}`, dates)
        console.log('Seu relatório foi gerado com sucesso! Está disponível em: ' + data.uri);
    }catch(error){
        console.error('Erro ao gerar relatório de estornos:', error.message);
    }
}