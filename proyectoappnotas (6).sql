drop database proyectoappnotas;
create database proyectoappnotas;
use proyectoappnotas;

SET FOREIGN_KEY_CHECKS=0;
create table usuarios(
	id int unsigned primary key auto_increment,
    email varchar(100) not null unique,
    contraseña varchar(512) not null,
    codigo_registro varchar(200) unique,
    alias varchar(20) not null unique,
    avatar varchar(100),
    activo boolean default false,
    deleted boolean default false,
    codigorecuperacion VARCHAR(100)
   
    
);

insert into usuarios(email, contraseña,codigo_registro,alias,avatar,activo)
values ('jhon@gmail.com','123456',null,'Jhon','panda',true),('fran@gmail.com','54321',null,'Fran','gato',true),
('usuario@gmail.com','25415',null,'Usuario','pepe',true),('usuario2@gmail.com','789456',null,'Usuario2','perro',true),
('usuario3@gmail.com','986532',null,'Usuario3','raton',true);

create table temas(
	id int unsigned primary key auto_increment,
    privada boolean not null,
    categoria varchar(20),
    titulo varchar(50) not null,
    fecha_creacion datetime not null,
    fecha_modificacion datetime,
    id_usuario int unsigned not null,
	foreign key (id_usuario) references usuarios(id)
);

insert into temas(privada, categoria, titulo, fecha_creacion, fecha_modificacion, id_usuario)
values(false,'Deportes','¿Morata deberia ser titular?','2021-06-21 12:32:10',null,1),
(true,null,'Cosas para el finde','2021-06-21 12:33:10',null,2),
(true,null,'Endpoints backend','2021-06-21 12:34:10',null,3),
(false,'Actualidad','Mascarillas si o no','2021-06-21 12:35:10',null,4),
(false,'Economia','¿Hay muchos turistas este año?','2021-06-21 12:36:10',null,5);

create table notas(
	id int unsigned primary key auto_increment,
    contenido varchar(250),
    fecha_creacion datetime not null,
    fecha_modificacion datetime,
    id_tema int unsigned not null,
    foreign key (id_tema) references temas(id),
    id_usuario int unsigned not null,
	foreign key (id_usuario) references usuarios(id)
);

insert into notas(contenido, fecha_creacion, fecha_modificacion,id_tema, id_usuario)
values('Si deberia serlo.','2021-06-21 18:05:10',null,1,1),
('Ir a la bolera','2021-06-21 18:06:10',null,2,2),
('Puedes ir a stackoverflow para obtener info','2021-06-21 18:07:10',null,3,3),
('Menos mal que ya se quitan','2021-06-21 18:08:10',null,4,4),
('Pues por culpa del covid no hay tantos como otros años','2021-06-21 18:09:10',null,5,5);

create table valoraciones(
	id_usuario int unsigned,
	foreign key (id_usuario) references usuarios(id),
    id_tema int unsigned,
    foreign key (id_tema) references temas(id),
    id_nota int unsigned,
    foreign key (id_nota) references notas(id),
    valoracion tinyint not null,
    constraint valoraciones_ck1 check (valoracion in(1,2,3,4,5))
);

insert into valoraciones(id_usuario,id_tema,id_nota, valoracion)
values(1,1,null,4),(1,null,1,5),(2,2,null,3),(2,null,2,5),(3,3,null,1),(3,null,3,2),(4,4,null,5),
(4,null,4,5),(5,5,null,3),(5,null,5,2),(1,2,null,1),(2,null,4,5),(3,1,null,4),(4,3,null,3),(5,4,null,2),
(2,5,null,2),(1,null,2,3),(3,null,4,1),(4,null,5,2),(5,null,4,4);

SET FOREIGN_KEY_CHECKS=1;