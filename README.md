Projeto Criado durante o curso Node.js do Zero a Maestria com diversos Projetos de Matheus Battisti

O projeto tem como objetivo tarazer o aprendizado de uma arquitetura MVC completa , sendo p projeto composto por autenticação , CRUD completo do mysql , utilização de ORM que no caso utilizamos o sequelize e toda parte de fluxe web de uma aplicação.

Fucionalidades Adicionadas :
[] : Comentarios
[] : Data de criação do pensamento
[] : Login com o google 

Rodando o Projeto:

1º : Fazer o push do projeto na sua maquina

2º : abrir o terminal na pasta onde estão os arquivos e executar o comando npm install para que as dependencias sejam instaladas e o projeto possa rodar.

3º : criar um schema no banco de dados com o mesmo nome QUE SERÁ COLOCADO NO VARIAVEL DE AMBIENTE MYSQL_DB  por padrão utilize toughts.

    querie para criação do schema : create schema toughts;

4º fazer a configuração das variaveis de ambiente.

    crie o arquivo .env e faça as seguintes configurações citadas abaixo:

    PORT= Porta aonde o projeto ira rodar no navegador ,geralmente se utiliza a porta 3000.
    MYSQL_HOST= Local aonde o banco de dados está localizado (ip do banco), geralmente o projeto é rodado localmente então se utiliza 127.0.0.1
    DIALECT=mysql Esse valor não pode ser mudado !!!
    MYSQL_PORT= Porta aonde o banco está rodando , geralmente a porta é a 3306
    MYSQL_USER= Nome do usuario para conexão com o banco
    MYSQL_PASSWORD= Senha do Usuario 
    MYSQL_DB= Nome do schema do banco de dados a ser utilizado por padrão utilize toughts 

    A ORM sequelize fara a criação de todas as tabelas e tudo para o banco esteja funcional.

5º execute o comando npm run start no terminal
    observe o log para ver se está tudo ok.
    ESPERADO VER:
    Conexão com o banco feita com sucesso !!!
    Executing (default): SELECT 1+1 AS result
    Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'Users' AND TABLE_SCHEMA = 'toughts'
    Executing (default): SHOW INDEX FROM `Users`
    Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'Toughts' AND TABLE_SCHEMA = 'toughts'
    Executing (default): SHOW INDEX FROM `Toughts`
    App rodando na porta : 3000 ou a que você escolehu 

Projeto rodando !!!