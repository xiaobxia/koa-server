DROP TABLE IF EXISTS sys_log_audit;

DROP TABLE IF EXISTS sys_user;

/*==============================================================*/
/* Table: sys_log_audit                                         */
/*==============================================================*/
CREATE TABLE sys_log_audit
(
   id                   BIGINT(9) NOT NULL AUTO_INCREMENT,
   log_type             VARCHAR(255) NOT NULL,
   user_id              BIGINT(9),
   user_name            VARCHAR(60) NOT NULL,
   user_code            VARCHAR(60) NOT NULL COMMENT '登陆账户',
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id)
)
AUTO_INCREMENT=1001 DEFAULT CHARACTER SET=UTF8;

/*==============================================================*/
/* Table: sys_user                                              */
/*==============================================================*/
CREATE TABLE sys_user
(
   user_id              BIGINT(9) NOT NULL AUTO_INCREMENT,
   user_name            VARCHAR(60) NOT NULL,
   user_code            VARCHAR(60) NOT NULL COMMENT '登陆账户',
   pwd                  VARCHAR(60) NOT NULL,
   mobile               VARCHAR(255),
   email                VARCHAR(255),
   create_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   update_date          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   state                CHAR(1) NOT NULL COMMENT 'A-在用，X-失效',
   state_date           DATETIME NOT NULL,
   is_locked            CHAR(1) NOT NULL DEFAULT 'N' COMMENT '是否锁定，''Y''-锁定，''N''-没有锁定，null表示''N''',
   force_login          CHAR(1) DEFAULT 'N' COMMENT 'Y允许强制登录，N不允许。默认N',
   login_fail           INT(6) NOT NULL COMMENT '登录失败次数，空表示0',
   unlock_date          DATETIME,
   PRIMARY KEY (user_id)
)
AUTO_INCREMENT=1001 DEFAULT CHARSET=UTF8;
