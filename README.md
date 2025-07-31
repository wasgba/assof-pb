Website da ASSOF/PB
Este repositório contém o código-fonte do website da Associação dos Oficiais da Polícia e Bombeiro Militar da Paraíba (ASSOF/PB). O site foi desenvolvido para servir como uma plataforma de comunicação, divulgação de notícias, eventos e, principalmente, como uma área restrita para os associados.

Funcionalidades Principais
Página Inicial (Hero Slider): Um carrossel de imagens que destaca a missão e os valores da ASSOF/PB.

Seção "Sobre": Detalhes sobre a história da associação, sua missão, visão, valores e a diretoria atual.

Notícias e Eventos: Seções dedicadas para manter os associados e visitantes informados sobre os últimos acontecimentos.

Área do Associado: Uma seção de acesso restrito que permite aos membros fazerem login com CPF e senha para acessarem informações pessoais, documentos internos (como o Estatuto) e gerenciarem sua situação financeira.

Fale Conosco: Um formulário de contato para que a comunidade possa enviar mensagens, sugestões ou denúncias.

Tecnologias Utilizadas
HTML5: Estrutura fundamental do website.

CSS3: Estilização e layout, com uso do Tailwind CSS para um design responsivo e moderno.

JavaScript: Lógica interativa, como a funcionalidade do slider de imagens e o formulário de login.

Google Firebase:

Firestore: Banco de dados NoSQL utilizado para armazenar e gerenciar os dados dos associados, permitindo o login e a exibição de informações dinâmicas na área restrita.

Firebase Authentication (Simulada): Gerenciamento de usuários para a área restrita. Para este protótipo, a autenticação é simplificada, buscando o usuário pelo CPF e verificando a senha no Firestore. Em uma aplicação real, a segurança seria aprimorada com a utilização de serviços de autenticação mais robustos do Firebase.

Como a Área do Associado Funciona
O sistema de login na Área do Associado foi desenvolvido como um protótipo funcional usando o Firestore como banco de dados.

O usuário insere seu CPF e senha.

O JavaScript do site se comunica com o Firestore para buscar um documento de usuário correspondente ao CPF fornecido.

Se um documento for encontrado e a senha coincidir (em um ambiente de produção, a senha seria validada de forma segura), o painel do associado é exibido, preenchido com os dados dinâmicos do banco de dados (nome, matrícula, situação financeira, etc.).

Um usuário de exemplo foi pré-configurado no banco de dados para fins de demonstração:

CPF: 123.456.789-00

Senha: senha123

Este README fornece uma visão geral clara e concisa do projeto, ideal para ser a primeira coisa que alguém vê ao visitar o repositório.
