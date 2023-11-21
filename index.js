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
                        leitor.question(`qual seu perfil?`, (answer) => resolve(answer));
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
                        leitor.question(`qual seu perfil?`, (answer) => resolve(answer));
                    });

                    const description = await new Promise((start) => {
                        leitor.question(`qual a descrição?`, (answer) => {
                            start(answer);
                        });
                    });

                    const employeeId = await new Promise((start) => {
                        leitor.question(`qual o seu id?`, (answer) => {
                            start(answer);
                        });
                    });

                    const price = await new Promise((start) => {
                        leitor.question(`qual o valor?`, (answer) => {
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
                        console.log('pedido de reembolso cadastrado com sucesso! Abaixo seguem as informações do pedido:')
                        console.log(data)
                    }catch(error){
                        console.error('Erro ao cadastrar pedido de reembolso:', error.message);
                    }

                    resolve();
                    break;
                };
                case '4': {

                        const perfil = await new Promise((resolve) => {
                            leitor.question(`qual seu perfil?`, (answer) => resolve(answer));
                        });
                        
                        const id = await new Promise((resolve) => {
                            leitor.question(`qual o id do funcionário desejado?`, (answer) => {
                                resolve(answer);
                            });
                        });
                    
                        const aux = {
                            id,
                        };
                    
                        const url = `http://localhost:8080/refunds/${perfil}`;
                    
                        try {
                            const { data } = await axios.get(url, aux);
                            console.table(
                                data.map((item) => {
                                    return {
                                        id: item.id,
                                        description: item.description,
                                        price: item.price,
                                        status: item.status,
                                        solicitateDate: item.solicitateDate,
                                        modificationDate: item.modificationDate,
                                    };
                                })
                            );
                        } catch (error) {
                            console.error('Erro ao obter o histórico de estorno:', error.message);
                        }
                    
                        resolve();
                        break;    
                };
                case '5': {
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

                    break;
                };
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