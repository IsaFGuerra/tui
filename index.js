import readline from 'readline'
import axios from 'axios';
var resp = "";

var leitor = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const terminal = `
Bem vindo ao TUI (Terminal User Interface) do Node.js

1. Aprovar ou Negar Reembolso
2. Gerar Relatório em PDF
3. Cadastrar/Pedir Reembolso
4. Olhar histórico de estorno de um funcionário
5. Gerar Relatório de Estornos em PDF

Qual opção você deseja? `

while(true){
    const promise = new Promise((resolve, reject) => {
        leitor.question(terminal, async function(answer) {
            var resp = answer;
            switch (resp){
                case '1': {
                        try {
                            const perfil = await new Promise((resolve) => {
                                leitor.question(`Qual seu perfil? `, (answer) => resolve(answer));
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
                                Digite o número correspondente a ação desejada:
                                1. Aprovar
                                2. Negar
                                `;
                                leitor.question(aux, (answer) => resolve2(answer));
                            });
                    
                            switch (approvalOption) {
                                case '1': {
                                    const id = await new Promise((resolve) => {
                                        leitor.question(`Qual o id do reembolso a ser aprovado? `, (answer) => resolve(answer));
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
                                        console.error('Erro ao aprovar reembolso ', error.message);
                                    }
                                    break;
                                }
                    
                                case '2': {
                                    const id = await new Promise((resolve) => {
                                        leitor.question(`Qual o id do reembolso a ser negado? `, (answer) => resolve(answer));
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
                                        console.error('Erro ao negar reembolso ', error.message);
                                    }
                                    break;
                                }
                            }
                    
                            const continueOption = await new Promise((resolve2) => {
                                leitor.question('Deseja continuar? (S/N) ', (answer) => resolve2(answer));
                            });
                    
                            if (continueOption.toUpperCase() !== 'S') {
                                console.log('Encerrando...');
                                break;
                            }
                    
                            console.clear();
                        } catch (error) {
                            console.error('Erro ao obter dados do servidor', error.message);
                        }
                        break;                  
                };
                case '2': {
                    const perfil = await new Promise((resolve) => {
                        leitor.question(`Qual seu perfil? `, (answer) => resolve(answer));
                    });
                    try{
                        const { data } = await axios.post(`http://localhost:8080/pdf/${perfil}`)
                        console.log('Seu relatório foi gerado com sucesso! Está disponível em: ' + data.uri);
                    }catch(error){
                        console.error('Erro ao gerar relatório:', error.message);
                    }

                    break;
                };
                case '3': {
                    const perfil = await new Promise((resolve) => {
                        leitor.question(`Qual seu perfil? `, (answer) => resolve(answer));
                    });

                    const description = await new Promise((start) => {
                        leitor.question(`Qual a descrição? `, (answer) => {
                            start(answer);
                        });
                    });

                    const employeeId = await new Promise((start) => {
                        leitor.question(`Qual o seu id? `, (answer) => {
                            start(answer);
                        });
                    });

                    const price = await new Promise((start) => {
                        leitor.question(`Qual o valor? `, (answer) => {
                            start(answer);
                        });
                    });

                    const aux = {
                        description,
                        employeeId: Number(employeeId), 
                        price: Number(price)
                    }

                    const url = `http://localhost:8080/refund/${perfil}`
                    try{
                        const { data } = await axios.post(url, aux)
                        console.log('Pedido de reembolso cadastrado com sucesso! Abaixo seguem as informações do pedido: ')
                        console.log(data)
                    }catch(error){
                        console.error('Erro ao cadastrar pedido de reembolso: ', error.message);
                    }

                    resolve();
                    break;
                };
                case '4': {
                    try{
                        const perfil = await new Promise((resolve2) => {
                            const aux = `
                            Qual seu perfil?:
                            1. Funcionário
                            2. Gerente
                            `;
                            leitor.question(aux, (answer) => resolve2(answer));
                        });
                
                        switch (perfil) {
                            case '1': {
                                const id = await new Promise((resolve) => {
                                    leitor.question(`Qual seu id? `, (answer) => resolve(answer));
                                });
                
                                try {
                                    const { data } = await axios.get(`http://localhost:8080/refunds/${id}`);
                                    console.table(data.map((item) => ({
                                        id: item.id,
                                        description: item.description,
                                        price: item.price,
                                        status: item.status,
                                        solicitateDate: item.solicitateDate,
                                        modificationDate: item.modificationDate,
                                    })));
        
                                    
                                } catch (error) {
                                    console.error('Erro ao retornar seu histórico de estornos ', error.message);
                                }
                                break;
                            };
                            case '2': {
                                const id = await new Promise((resolve) => {
                                    leitor.question(`Qual o id do funcionário que deseja ver o histórico de estornos? `, (answer) => resolve(answer));
                                });

                                try{
                                    const { data } = await axios.get(`http://localhost:8080/refunds/${id}`);
                                    console.table(data.map((item) => ({
                                        id: item.id,
                                        description: item.description,
                                        price: item.price,
                                        status: item.status,
                                        solicitateDate: item.solicitateDate,
                                        modificationDate: item.modificationDate,
                                    })));
                                }catch(error){
                                    console.error(`Erro ao retornar o histórico de estornos do funcionário ${id}`, error.message);
                                }

                        const continueOption = await new Promise((resolve2) => {
                            leitor.question('Deseja continuar? (S/N) ', (answer) => resolve2(answer));
                        });
                
                        if (continueOption.toUpperCase() !== 'S') {
                            console.log('Encerrando...');
                            break;
                        }
                
                        console.clear();
                        resolve();
                        break;    
                    }
                    }
                }catch(error){
                    console.error('Erro ao obter dados do servidor ', error.message);
                }
                break;
            };
                case '5': {
                        const perfil = await new Promise((resolve) => {
                            leitor.question(`Qual seu perfil? `, (answer) => resolve(answer));
                        });

                        if(perfil != 'MANAGER'){
                            throw new Error(error)
                        }
    
                        const startDate = await new Promise((start) => {
                            leitor.question(`A partir de qual data deseja ver os reembolsos? `, (answer) => {
                                start(answer);
                            });
                        });
    
                        const endDate = await new Promise((end) => {
                            leitor.question(`A partir de qual data deseja ver os reembolsos? `, (answer) => {
                                end(answer);
                            });
    
                        });
    
                        const dates = {
                            startDate,
                            endDate
                        }
                        
                        try{
                            const { data } = await axios.post(`http://localhost:8080/list/refunds/`, dates)
                            console.log('Seu relatório foi gerado com sucesso! Está disponível em: ' + data.uri);
                        }catch(error){
                            console.error('Erro ao gerar relatório de estornos: ', error.message);
                        }
    
                        break;
                }
                default: {
                    console.log('Opção inválida');
                }
            }
            resolve();
        });
    })

    await promise;

    const promise2 = new Promise((resolve, reject) => {
        leitor.question('Deseja continuar? (S/N) ', function(answer) {
            var resp = answer;
            if(resp == 'N'){
                leitor.close();
            }
            resolve();
        });
    })
    await promise2;
    console.clear()
    
}