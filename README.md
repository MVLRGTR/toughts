Projeto Criado durante o curso Node.js do Zero a Maestria com diversos Projetos de Matheus Battisti

O projeto tem como objetivo trazer o aprendizado de uma arquitetura MVC completa , sendo o projeto composto por autenticação , CRUD completo do mysql , utilização de ORM que no caso utilizamos o sequelize e toda parte de fluxo da arquitetura MVC.

Fucionalidades Adicionadas :
[x] : Data de criação do pensamento
[x] : Data de edição do pensamento
[x] : Mostrar se um pensamento foi editado
[x] : Comentários
[x] : Data de criação do comentário
[x] : Data de edição do comentário
[x] : Mostrar se um comentário foi editado
[x] : Adição do checkAuth (checagem de autenticaçaõ redundante) para todas as rotas de post
[x] : Token para primeiro Login
[] : Buscar um comentário
[] : validação de conta por e-mail para primeiro acesso
[] : Esqueceu Login , enviando token por email


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
    Executing (default): SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME = 'Comments' AND TABLE_SCHEMA = 'toughts'
    Executing (default): SHOW INDEX FROM `Comments`
    App rodando na porta : 3000 ou a que você escolheu

Projeto rodando !!!