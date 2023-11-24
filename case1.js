async function AprovarOuNegarReembolsos(){
    const perfil = await new Promise((resolve) => {
        leitor.question(`qual seu perfil?`, (answer) => resolve(answer));
    });

    const { data } = await axios.get(`http://localhost:8080/list/${perfil}`);
    console.table(data.map((item) => ({
        id: item.id,
        description: item.description,
        price: item.price,
        date: item.solicitateDate,
    })));

    const approvalOption = await new Promise((resolve2) => {
        const aux = `
        digite o número correspondente a ação desejada:
        1. aprovar
        2. negar
        `;
        leitor.question(aux, (answer) => resolve2(answer));
    });

    switch (approvalOption) {
        case '1': {
            const id = await new Promise((resolve) => {
                leitor.question(`qual o id do reembolso a ser aprovado?`, (answer) => resolve(answer));
            });

            const status = 'APPROVED';
            const body = {
                status: status,
                id: Number(id),
            };

            try {
                const url = 'http://localhost:8080/update';
                const { data } = await axios.put(url, body);
                console.log('Reembolso aprovado com sucesso!');
            } catch (error) {
                console.error('Erro ao aprovar reembolso', error.message);
            }
            break;
        }

        case '2': {
            const id = await new Promise((resolve) => {
                leitor.question(`qual o id do reembolso a ser negado?`, (answer) => resolve(answer));
            });

            const status = 'DENIED';
            const aux11 = {
                status: status,
                id: Number(id),
            };

            try {
                const url = 'http://localhost:8080/update';
                const { data } = await axios.put(url, aux11);
                console.log('Reembolso negado com sucesso!');
            } catch (error) {
                console.error('Erro ao negar reembolso', error.message);
            }
            break;
        }
    }

    console.clear();
}