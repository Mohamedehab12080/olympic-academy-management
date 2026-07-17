-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: olympic_academy_db
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `databasechangelog`
--

DROP TABLE IF EXISTS `databasechangelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `databasechangelog` (
  `ID` varchar(255) NOT NULL,
  `AUTHOR` varchar(255) NOT NULL,
  `FILENAME` varchar(255) NOT NULL,
  `DATEEXECUTED` datetime NOT NULL,
  `ORDEREXECUTED` int NOT NULL,
  `EXECTYPE` varchar(10) NOT NULL,
  `MD5SUM` varchar(35) DEFAULT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `COMMENTS` varchar(255) DEFAULT NULL,
  `TAG` varchar(255) DEFAULT NULL,
  `LIQUIBASE` varchar(20) DEFAULT NULL,
  `CONTEXTS` varchar(255) DEFAULT NULL,
  `LABELS` varchar(255) DEFAULT NULL,
  `DEPLOYMENT_ID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `databasechangelog`
--

LOCK TABLES `databasechangelog` WRITE;
/*!40000 ALTER TABLE `databasechangelog` DISABLE KEYS */;
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/user/_liquibase/changes/changeset-2026-04-03.xml','2026-07-17 00:09:57',1,'EXECUTED','9:158ac77f1bd53f8b1d3832165919881a','createTable tableName=oa_user; addForeignKeyConstraint baseTableName=oa_user, constraintName=fk_user_created_by, referencedTableName=oa_user; addForeignKeyConstraint baseTableName=oa_user, constraintName=fk_user_last_modified_by_id, referencedTabl...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/user/_liquibase/changes/changeset-2026-04-04.xml','2026-07-17 00:09:57',2,'EXECUTED','9:2ecfc1b06024f4972966d17ec506250b','createTable tableName=oa_token; addForeignKeyConstraint baseTableName=oa_token, constraintName=fk_user_token, referencedTableName=oa_user','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','ahmed.kasim','../../../../lib/service-context/_liquibase/changes/changeset-2025-06-25.xml','2026-07-17 00:09:57',3,'EXECUTED','9:cda0617c75b7fd5cd3f0ab2a549cfa2e','createTable tableName=sc_domain','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','ahmed.kasim','../../../../lib/service-context/_liquibase/changes/changeset-2025-06-25.xml','2026-07-17 00:09:57',4,'EXECUTED','9:b87216be6ab5635828e64683afe8ef2f','createTable tableName=sc_event','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-14.xml','2026-07-17 00:09:57',5,'EXECUTED','9:84397c736b9ca1dffb07c3dbe07fde6f','createTable tableName=fl_domain_config; addForeignKeyConstraint baseTableName=fl_domain_config, constraintName=fk_fl_file_sc_domain, referencedTableName=sc_domain','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-14.xml','2026-07-17 00:09:58',6,'EXECUTED','9:7298b1c6d4c356283285f57641430d79','createTable tableName=fl_file; addForeignKeyConstraint baseTableName=fl_file, constraintName=fk_fl_file_domain_config, referencedTableName=fl_domain_config; addForeignKeyConstraint baseTableName=fl_file, constraintName=fk_fl_file_created_by_id, re...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('3','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-14.xml','2026-07-17 00:09:58',7,'EXECUTED','9:0ec8cf65135ef5e4d98b90e7ade64dd1','createTable tableName=fl_file_version; addForeignKeyConstraint baseTableName=fl_file_version, constraintName=fk_file_version_fl_file, referencedTableName=fl_file; addForeignKeyConstraint baseTableName=fl_file_version, constraintName=fk_file_versio...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('4','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-18.xml','2026-07-17 00:09:59',8,'EXECUTED','9:f4e54597deb8fce71cc7a2287345fa6d','dropNotNullConstraint columnName=created_on, tableName=fl_file; dropNotNullConstraint columnName=created_by_id, tableName=fl_file; dropNotNullConstraint columnName=last_modified_on, tableName=fl_file; dropNotNullConstraint columnName=last_modified...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('5','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-18.xml','2026-07-17 00:09:59',9,'EXECUTED','9:f7b62bcf43283f4f16f716d289358919','dropNotNullConstraint columnName=last_modified_on, tableName=fl_domain_config; dropNotNullConstraint columnName=last_modified_by_id, tableName=fl_domain_config','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('6','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-18.xml','2026-07-17 00:09:59',10,'EXECUTED','9:fdfa875c087f2379e77d4f2356290644','addColumn tableName=fl_file_version','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('7','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-18.xml','2026-07-17 00:09:59',11,'EXECUTED','9:4e94b1af6089539379e2673d0efff35b','dropNotNullConstraint columnName=created_on, tableName=fl_file_version; dropNotNullConstraint columnName=created_by_id, tableName=fl_file_version; dropNotNullConstraint columnName=version, tableName=fl_file_version; dropNotNullConstraint columnNam...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('9','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-21.xml','2026-07-17 00:09:59',12,'EXECUTED','9:c0b8e05cfea4728d64949ac03f319ed9','dropColumn columnName=original_filename, tableName=fl_file_version','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('10','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-22.xml','2026-07-17 00:09:59',13,'EXECUTED','9:312821320d6f1ed4eab4e0fd0ec77a3b','createTable tableName=fl_daily_counter; addDefaultValue columnName=count, tableName=fl_daily_counter; insert tableName=fl_daily_counter','Creates daily_counter table for tracking file ID generation sequence',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('11','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-23.xml','2026-07-17 00:09:59',14,'EXECUTED','9:414dfde4c7f20e0e885bcfea621ac747','addColumn tableName=fl_file_version','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('12','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-23.xml','2026-07-17 00:10:00',15,'EXECUTED','9:98b56347dee4602073b9015f5888e9d9','addNotNullConstraint columnName=domain_id, tableName=fl_file; addNotNullConstraint columnName=fid, tableName=fl_file; addNotNullConstraint columnName=version, tableName=fl_file_version; addNotNullConstraint columnName=size, tableName=fl_file_versi...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('13','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-23.xml','2026-07-17 00:10:00',16,'EXECUTED','9:b1e48be534377a65f2662c744e4046af','addDefaultValue columnName=created_on, tableName=fl_file; addDefaultValue columnName=last_modified_on, tableName=fl_file; addDefaultValue columnName=last_modified_on, tableName=fl_domain_config; addDefaultValue columnName=created_on, tableName=fl_...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('14','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-23.xml','2026-07-17 00:10:00',17,'EXECUTED','9:0866f6f7291bffc0663d549a6258c1ba','dropColumn columnName=title, tableName=fl_file','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('11','mahmoud.zain','../../../service/file/_liquibase/changes/changeset-2025-08-27.xml','2026-07-17 00:10:00',18,'EXECUTED','9:fcf107f65a9a29d71e0b40513bad5fde','addColumn tableName=fl_domain_config','Add label column to sc_domain table',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('12','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-27.xml','2026-07-17 00:10:00',19,'EXECUTED','9:2ed0032d815e16027c70a5fbb37dc7b8','modifyDataType columnName=max_size, tableName=fl_domain_config','update max_size type in sc_domain table',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('13','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-08-31.xml','2026-07-17 00:10:00',20,'EXECUTED','9:963c346fe37c3dc1e1bc003126dba761','dropTable tableName=fl_daily_counter','Drop dailyCounter table',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('14','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-09-15.xml','2026-07-17 00:10:00',21,'EXECUTED','9:4b5d71247f06d2eb4e7fae6e954fed61','createTable tableName=fl_daily_counter; insert tableName=fl_daily_counter','Recreates daily_counter table for tracking file ID generation sequence',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('15','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-09-15.xml','2026-07-17 00:10:00',22,'EXECUTED','9:492086221e8748807c9f56f98b78b181','dropColumn columnName=last_modified_on, tableName=fl_domain_config; dropColumn columnName=last_modified_by_id, tableName=fl_domain_config','Remove last_modified_on and last_modified_by_id columns from sc_domain table',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('16','mohamed.ehab','../../../service/file/_liquibase/changes/changeset-2025-09-15.xml','2026-07-17 00:10:00',23,'EXECUTED','9:2d43fd94a91d4a32e6db756deb24fb16','addColumn tableName=fl_file','Add entity_id column to fl_file table to track entity relationships',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('17','mahmoud.zain','../../../service/file/_liquibase/changes/changeset-2025-09-18.xml','2026-07-17 00:10:00',24,'EXECUTED','9:bebaeb30ef0322c094b3ce267ddef8b1','renameColumn newColumnName=last_modified_on, oldColumnName=last_updated, tableName=fl_daily_counter','Rename last_updated to last_modified_on in daily_counter table',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('11','mahmoud.zain','../../../service/file/_liquibase/changes/changeset-2025-09-19.xml','2026-07-17 00:10:00',25,'EXECUTED','9:10562be79986da013930dfc6dc339755','addColumn tableName=fl_domain_config; addColumn tableName=fl_domain_config','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','shadhd.abdelnaby','../../../service/file/_liquibase/changes/changeset-2025-09-22.xml','2026-07-17 00:10:01',26,'EXECUTED','9:402e73149e442e708563b6f24d0bfbcf','dropNotNullConstraint columnName=last_modified_on, tableName=fl_domain_config; dropNotNullConstraint columnName=last_modified_by_id, tableName=fl_domain_config','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('12','mahmoud.zain','../../../service/file/_liquibase/changes/changeset-2025-09-23.xml','2026-07-17 00:10:01',27,'EXECUTED','9:5806be75dd82cd5227a9a10afcf8c5a3','modifyDataType columnName=last_modified_on, tableName=fl_domain_config; modifyDataType columnName=last_modified_by_id, tableName=fl_domain_config','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/file/_liquibase/changes/trainee/changeset-2025-11-7.xml','2026-07-17 00:10:01',28,'EXECUTED','9:861a897b4ea15d2ee55460070cf385db','insert tableName=sc_domain','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','mohamed.ehab','../../../service/file/_liquibase/changes/trainee/changeset-2025-11-7.xml','2026-07-17 00:10:01',29,'EXECUTED','9:03beab13c19530966460f40158958a38','insert tableName=sc_domain','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('3','alaa.esam','../../../service/file/_liquibase/changes/trainee/changeset-2025-11-7.xml','2026-07-17 00:10:01',30,'EXECUTED','9:fee17aa74869d116a52995b2d5de713b','insert tableName=fl_domain_config','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('4','alaa.esam','../../../service/file/_liquibase/changes/trainee/changeset-2025-11-7.xml','2026-07-17 00:10:01',31,'EXECUTED','9:81ee2be8b8b536cc02fa937cfe4134bc','insert tableName=fl_domain_config','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/file/_liquibase/changes/employee/changeset-2026-06-12.xml','2026-07-17 00:10:01',32,'EXECUTED','9:99794ab794ecd3b5e44475201d939f47','insert tableName=sc_domain','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','alaa.esam','../../../service/file/_liquibase/changes/employee/changeset-2026-06-12.xml','2026-07-17 00:10:01',33,'EXECUTED','9:9cee499d20a01de6248588d7dd2cfa3e','insert tableName=fl_domain_config','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/department/_liquibase/changes/changeset-2026-05-24.xml','2026-07-17 00:10:01',34,'EXECUTED','9:cea9553c5a15f8a7f3a67c346a8c59f9','createTable tableName=oa_department; addForeignKeyConstraint baseTableName=oa_department, constraintName=fk_department_created_by, referencedTableName=oa_user; addForeignKeyConstraint baseTableName=oa_department, constraintName=fk_department_modif...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/course/_liquibase/changes/changeset-2026-05-24.xml','2026-07-17 00:10:02',35,'EXECUTED','9:e0ecf71c3e761c1ac277e4864b79c681','createTable tableName=oa_course; addForeignKeyConstraint baseTableName=oa_course, constraintName=fk_course_department, referencedTableName=oa_department; addForeignKeyConstraint baseTableName=oa_course, constraintName=fk_course_created_by, referen...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/employee/_liquibase/changes/changeset-2026-05-24.xml','2026-07-17 00:10:02',36,'EXECUTED','9:d3f2687a71d9be84fc13cc07aa102fcb','createTable tableName=oa_employee; addForeignKeyConstraint baseTableName=oa_employee, constraintName=fk_employee_created_by, referencedTableName=oa_user; addForeignKeyConstraint baseTableName=oa_employee, constraintName=fk_employee_modified_by, re...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','mohamed.ehab','../../../service/employee/_liquibase/changes/changeset-2026-05-24.xml','2026-07-17 00:10:02',37,'EXECUTED','9:038ef54a498cd076fdcde8f48566b03a','createTable tableName=oa_employee_contact; addForeignKeyConstraint baseTableName=oa_employee_contact, constraintName=fk_emp_contact_employee, referencedTableName=oa_employee; addForeignKeyConstraint baseTableName=oa_employee_contact, constraintNam...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('3','mohamed.ehab','../../../service/employee/_liquibase/changes/changeset-2026-05-24.xml','2026-07-17 00:10:02',38,'EXECUTED','9:49e75465206a4410b2ac361269507b89','createTable tableName=oa_employee_department; addForeignKeyConstraint baseTableName=oa_employee_department, constraintName=fk_employee_department_created_by, referencedTableName=oa_user; addForeignKeyConstraint baseTableName=oa_employee_department...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/trainee/_liquibase/changes/changeset-2026-05-24.xml','2026-07-17 00:10:03',39,'EXECUTED','9:62091dbdd906aa6a57ae9782cc90a506','createTable tableName=oa_trainee; addForeignKeyConstraint baseTableName=oa_trainee, constraintName=fk_trainee_created_by, referencedTableName=oa_user; addForeignKeyConstraint baseTableName=oa_trainee, constraintName=fk_trainee_modified_by, referen...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','mohamed.ehab','../../../service/trainee/_liquibase/changes/changeset-2026-05-24.xml','2026-07-17 00:10:03',40,'EXECUTED','9:579445041b0f04e4be96ca5a45f72dcf','createTable tableName=oa_trainee_contact; addForeignKeyConstraint baseTableName=oa_trainee_contact, constraintName=fk_trainee_contact_trainee, referencedTableName=oa_trainee; addForeignKeyConstraint baseTableName=oa_trainee_contact, constraintName...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('3','mohamed.ehab','../../../service/trainee/_liquibase/changes/changeset-2026-05-24.xml','2026-07-17 00:10:04',41,'EXECUTED','9:0075ef993dc44cf81cfee71cd605129d','createTable tableName=oa_trainee_certificate; addForeignKeyConstraint baseTableName=oa_trainee_certificate, constraintName=fk_certificate_trainee, referencedTableName=oa_trainee; addForeignKeyConstraint baseTableName=oa_trainee_certificate, constr...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('4','mohamed.ehab','../../../service/trainee/_liquibase/changes/changeset-2026-05-24.xml','2026-07-17 00:10:04',42,'EXECUTED','9:48d3a36f152e91d5ca964ba06a41fa78','createTable tableName=oa_health_condition; addForeignKeyConstraint baseTableName=oa_health_condition, constraintName=fk_health_condition_trainee, referencedTableName=oa_trainee; addForeignKeyConstraint baseTableName=oa_health_condition, constraint...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/enrollment/_liquibase/changes/changeset-2026-05-24.xml','2026-07-17 00:10:04',43,'EXECUTED','9:884999945b11c5e2d78ae1c98e8f3ab9','createTable tableName=oa_enrollment_type','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','mohamed.ehab','../../../service/enrollment/_liquibase/changes/changeset-2026-05-24.xml','2026-07-17 00:10:05',44,'EXECUTED','9:22f915cb17c465b01e438eb845e750a1','createTable tableName=oa_enrollment; addUniqueConstraint constraintName=uq_trainee_course, tableName=oa_enrollment; addForeignKeyConstraint baseTableName=oa_enrollment, constraintName=fk_enrollment_type, referencedTableName=oa_enrollment_type; add...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/financial/_liquibase/changes/enrollmentPayment/changeset-2026-05-24.xml','2026-07-17 00:10:05',45,'EXECUTED','9:5738430842b260bebfb46ef76ca87861','createTable tableName=oa_payment_method','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','mohamed.ehab','../../../service/financial/_liquibase/changes/enrollmentPayment/changeset-2026-05-24.xml','2026-07-17 00:10:05',46,'EXECUTED','9:056ab2d1aeda8318a45a98036cf94420','createTable tableName=oa_enrollment_payment; addForeignKeyConstraint baseTableName=oa_enrollment_payment, constraintName=fk_enrollment_payment_enrollment, referencedTableName=oa_enrollment; addForeignKeyConstraint baseTableName=oa_enrollment_payme...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('3','mohamed.ehab','../../../service/financial/_liquibase/changes/enrollmentPayment/changeset-2026-05-24.xml','2026-07-17 00:10:06',47,'EXECUTED','9:5a5c25bb9b58113abd2b342e96b650df','createTable tableName=oa_enrollment_refund; addForeignKeyConstraint baseTableName=oa_enrollment_refund, constraintName=fk_enrollment_refund_enrollment, referencedTableName=oa_enrollment; addForeignKeyConstraint baseTableName=oa_enrollment_refund, ...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/financial/_liquibase/changes/expenses/changeset-2026-05-24.xml','2026-07-17 00:10:06',48,'EXECUTED','9:eadcfd45143bb369b0d41eb06a6335e7','createTable tableName=oa_expense_type; addForeignKeyConstraint baseTableName=oa_expense_type, constraintName=fk_expense_type_created_by, referencedTableName=oa_user','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','mohamed.ehab','../../../service/financial/_liquibase/changes/expenses/changeset-2026-05-24.xml','2026-07-17 00:10:07',49,'EXECUTED','9:919e0958fbbd74a16da34846bd8f275c','createTable tableName=oa_expense; addForeignKeyConstraint baseTableName=oa_expense, constraintName=fk_expense_payment_method, referencedTableName=oa_payment_method; addForeignKeyConstraint baseTableName=oa_expense, constraintName=fk_expense_create...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','mohamed.ehab','../../../service/financial/_liquibase/changes/salariesAndIncentives/changeset-2026-05-25.xml','2026-07-17 00:10:07',50,'EXECUTED','9:02dd52195fc3d79322430883128dc3e7','createTable tableName=oa_salary_incentive; addForeignKeyConstraint baseTableName=oa_salary_incentive, constraintName=fk_salary_incentive_employee, referencedTableName=oa_employee; addForeignKeyConstraint baseTableName=oa_salary_incentive, constrai...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/financial/_liquibase/changes/salaryDeduction/changeset-2026-05-25.xml','2026-07-17 00:10:07',51,'EXECUTED','9:69752b48d8b12f8a1e4325361893f568','createTable tableName=oa_salary_deduction; addForeignKeyConstraint baseTableName=oa_salary_deduction, constraintName=fk_salary_deduction_employee, referencedTableName=oa_employee; addForeignKeyConstraint baseTableName=oa_salary_deduction, constrai...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/place/_liquibase/changes/changeset-2026-05-26.xml','2026-07-17 00:10:08',52,'EXECUTED','9:a37ab0b2f42a57658e1e5a703809e8b0','createTable tableName=oa_place; addForeignKeyConstraint baseTableName=oa_place, constraintName=fk_place_created_by, referencedTableName=oa_user; addForeignKeyConstraint baseTableName=oa_place, constraintName=fk_place_modified_by, referencedTableNa...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/employee/_liquibase/changes/changeset-2026-05-26.xml','2026-07-17 00:10:08',53,'EXECUTED','9:e22678bec95adeb895d560d4bf55d895','createTable tableName=oa_employee_attendance; addForeignKeyConstraint baseTableName=oa_employee_attendance, constraintName=fk_employee_attendance_employee, referencedTableName=oa_employee; addForeignKeyConstraint baseTableName=oa_employee_attendan...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','mohamed.ehab','../../../service/employee/_liquibase/changes/changeset-2026-05-26.xml','2026-07-17 00:10:08',54,'EXECUTED','9:311699b2c40a165159a876917704c23f','createTable tableName=oa_course_session; addUniqueConstraint constraintName=uq_employee_course, tableName=oa_course_session; addForeignKeyConstraint baseTableName=oa_course_session, constraintName=fk_session_created_by, referencedTableName=oa_user...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('3','mohamed.ehab','../../../service/employee/_liquibase/changes/changeset-2026-05-26.xml','2026-07-17 00:10:09',55,'EXECUTED','9:3d3e7b15dcbd9609772033e66c87441e','createTable tableName=oa_trainer_course; addForeignKeyConstraint baseTableName=oa_trainer_course, constraintName=fk_trainer_course_employee, referencedTableName=oa_employee; addForeignKeyConstraint baseTableName=oa_trainer_course, constraintName=f...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/trainee/_liquibase/changes/attendance/changeset-2026-05-26.xml','2026-07-17 00:10:09',56,'EXECUTED','9:0d0335cc2f589fc1f6a88296deb95e38','createTable tableName=oa_trainee_attendance; addForeignKeyConstraint baseTableName=oa_trainee_attendance, constraintName=fk_trainee_attendance_trainee, referencedTableName=oa_trainee; addForeignKeyConstraint baseTableName=oa_trainee_attendance, co...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/financial/_liquibase/changes/place/changeset-2026-05-26.xml','2026-07-17 00:10:09',57,'EXECUTED','9:c9d90b99fe27c17a0318f002c31f0b9d','createTable tableName=oa_rent_type; addForeignKeyConstraint baseTableName=oa_rent_type, constraintName=fk_rent_type_created_by, referencedTableName=oa_user','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','mohamed.ehab','../../../service/financial/_liquibase/changes/place/changeset-2026-05-26.xml','2026-07-17 00:10:10',58,'EXECUTED','9:be723aadcb7f454c8db4fc35f42af9ef','createTable tableName=oa_place_rent_payment; addForeignKeyConstraint baseTableName=oa_place_rent_payment, constraintName=fk_place_rent_payment_rent_type, referencedTableName=oa_rent_type; addForeignKeyConstraint baseTableName=oa_place_rent_payment...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/employee/_liquibase/changes/changeset-2026-06-21.xml','2026-07-17 00:10:10',59,'EXECUTED','9:dd6c282f451da5d20495078aa5f3e678','addColumn tableName=oa_course_session','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/employee/_liquibase/changes/changeset-2026-06-23.xml','2026-07-17 00:10:10',60,'EXECUTED','9:feaeaf8ceb0781de70f38bd27b1caf72','dropUniqueConstraint constraintName=uq_employee_course, tableName=oa_course_session; addUniqueConstraint constraintName=uq_employee_course_session_day, tableName=oa_course_session','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','changes/common/changeset-2026-06-28.xml','2026-07-17 00:10:10',61,'EXECUTED','9:a5ac65a1eb0153b51bc7dd88af949217','createTable tableName=oa_constant; addForeignKeyConstraint baseTableName=oa_constant, constraintName=fk_constant_created_by, referencedTableName=oa_user','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','mohamed.ehab','changes/common/changeset-2026-06-28.xml','2026-07-17 00:10:10',62,'EXECUTED','9:bc756163f110256cec930e3879f69981','addColumn tableName=oa_constant','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/employee/_liquibase/changes/changeset-2026-07-01-.xml','2026-07-17 00:10:11',63,'EXECUTED','9:12b2844f0b934f52166b564a33a88366','createTable tableName=oa_trainer_course_session; addForeignKeyConstraint baseTableName=oa_trainer_course_session, constraintName=fk_trainer_course_session_employee, referencedTableName=oa_employee; addForeignKeyConstraint baseTableName=oa_trainer_...','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:11',64,'EXECUTED','9:406d7978a1134c3047c95ac692802587','createIndex indexName=idx_session_employee_day_time, tableName=oa_course_session','Add composite index for scheduling conflict detection (employee + day + time)',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('2','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:11',65,'EXECUTED','9:140087e51c3b2568bb4a4b0c271adde8','createIndex indexName=idx_session_course_status, tableName=oa_course_session','Add index for active course sessions per course',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('3','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:11',66,'EXECUTED','9:3d7cb701db6399b944c4063a962d46c1','createIndex indexName=idx_course_session_course_id, tableName=oa_course_session','Add index on course_id for faster session lookups',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('4','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:11',67,'EXECUTED','9:a8645c9d3078b3c856e38cd23b68b548','createIndex indexName=idx_course_session_employee_id, tableName=oa_course_session','Add index on employee_id for trainer schedule lookups',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('5','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:11',68,'EXECUTED','9:cd68f77eb4cf53dd54fcc11153f4e83d','createIndex indexName=idx_course_session_place_id, tableName=oa_course_session','Add index on place_id for venue-based queries',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('6','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:11',69,'EXECUTED','9:1010db11d9a6aaaba64f2f6b7630f9aa','createIndex indexName=idx_enrollment_trainee_status, tableName=oa_enrollment','Add composite index for trainee enrollments with status',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('7','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:11',70,'EXECUTED','9:e0ee5e30cbd18423c47c10cbff94c4d4','createIndex indexName=idx_enrollment_course_dates, tableName=oa_enrollment','Add composite index for course enrollments with date range',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('8','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:11',71,'EXECUTED','9:7e17b5095897e07b717e0b87d8c4dd91','createIndex indexName=idx_enrollment_payment_status, tableName=oa_enrollment','Add index for payment status financial reporting',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('9','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:11',72,'EXECUTED','9:bfe3c147740b8d1f3d47e283548802ce','createIndex indexName=idx_enrollment_trainer_active, tableName=oa_enrollment','Add index for trainer workload management',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('10','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:11',73,'EXECUTED','9:4a38f88b9551c8e68fba26460accd0a2','createIndex indexName=idx_enrollment_created_active, tableName=oa_enrollment','Add index for enrollment dashboard count queries',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('11','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:11',74,'EXECUTED','9:ed5bdee7013fc887b7a599282b4eec3b','createIndex indexName=idx_enrollment_created_status, tableName=oa_enrollment','Add index for enrollment status dashboard queries',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('12','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:11',75,'EXECUTED','9:bb4699c8215bbc6333e7b8bef421fc8d','createIndex indexName=idx_attendance_trainee_date, tableName=oa_trainee_attendance','Add composite index for trainee attendance history by date',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('13','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',76,'EXECUTED','9:a34a373da948c62c8ccd906037afd9c2','createIndex indexName=idx_attendance_session_status, tableName=oa_trainee_attendance','Add index for session attendance summaries',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('14','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',77,'EXECUTED','9:dcd62b76a0f9c1a6d6a1dcd7936e4c38','createIndex indexName=idx_attendance_date_status, tableName=oa_trainee_attendance','Add index for date range attendance reports',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('15','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',78,'EXECUTED','9:28bddf3ebb9daad7aa6b668a9dd78240','createIndex indexName=idx_employee_contact_value, tableName=oa_employee_contact','Add index for contact value searches (phone/email lookups)',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('16','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',79,'EXECUTED','9:a3061563bd35612e520df5bcda9c13b7','createIndex indexName=idx_employee_contact_type, tableName=oa_employee_contact','Add composite index for employee contacts by type',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('17','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',80,'EXECUTED','9:c44886d44aee8881be6ff42fd3afe71b','createIndex indexName=idx_trainee_contact_value, tableName=oa_trainee_contact','Add index for trainee contact value searches',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('18','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',81,'EXECUTED','9:2c6119d37bcd64ea5c4df39e3fe6302d','createIndex indexName=idx_trainer_course_employee_course, tableName=oa_trainer_course','Add composite index for trainer-course assignments',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('19','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',82,'EXECUTED','9:ade72bbd7deae4e803f3a2d1442232e7','createIndex indexName=idx_emp_dept_employee_department, tableName=oa_employee_department','Add composite index for department memberships',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('20','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',83,'EXECUTED','9:9944877e52176629d53f221569a184b9','createIndex indexName=idx_course_department_active, tableName=oa_course','Add index for department courses with active status',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('21','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',84,'EXECUTED','9:34a87669463b90d7bdf542e931522c07','createIndex indexName=idx_course_dates_active, tableName=oa_course','Add index for course date range queries',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('22','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',85,'EXECUTED','9:a601c04dd6a4cdf4eca707fc078d48c9','createIndex indexName=idx_employee_active, tableName=oa_employee','Add index for active employee lookups',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('23','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',86,'EXECUTED','9:c98ee35ac3552307500c9d0cba2a3903','createIndex indexName=idx_employee_type_active, tableName=oa_employee','Add composite index for employee type queries',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('24','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',87,'EXECUTED','9:285a22ca2aca57ce24ea00c0ace63aab','createIndex indexName=idx_trainee_active, tableName=oa_trainee','Add index for active trainee lookups',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('25','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',88,'EXECUTED','9:21d11fa9cee88b1f259e29e1cad69d21','createIndex indexName=idx_emp_attendance_employee_date, tableName=oa_employee_attendance','Add index for employee attendance by date',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('26','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',89,'EXECUTED','9:07ff2f1664568eedc6108ff778ab8395','createIndex indexName=idx_enrollment_payment_date, tableName=oa_enrollment_payment','Add index for enrollment payments by date',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('27','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',90,'EXECUTED','9:311ae210f4ed17f6e266363bebdb8c27','createIndex indexName=idx_enrollment_payment_status, tableName=oa_enrollment_payment','Add index for payment status queries',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('28','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',91,'EXECUTED','9:bdd2cfc1539c38c10f40a9a213702ef8','createIndex indexName=idx_salary_incentive_emp_date, tableName=oa_salary_incentive','Add index for employee salary transactions by date',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('29','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',92,'EXECUTED','9:6dcda3ee220a3665823af2c4bc2b4e18','createIndex indexName=idx_salary_incentive_date_type, tableName=oa_salary_incentive','Add index for salary reporting with type and date',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('30','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',93,'EXECUTED','9:620e09b8b6786e01eee64cc5f7c5be1a','createIndex indexName=idx_salary_incentive_emp_type_date, tableName=oa_salary_incentive','Add index for employee salary type reporting',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('31','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:12',94,'EXECUTED','9:3d713ed2091a9a7ea455afd6470aa725','createIndex indexName=idx_salary_deduction_emp_date, tableName=oa_salary_deduction','Add index for employee deductions by date',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('32','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:13',95,'EXECUTED','9:af52805c2ed0bc03389cd643d51d4f76','createIndex indexName=idx_expense_date, tableName=oa_expense','Add index for expense date range queries',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('33','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:13',96,'EXECUTED','9:9e63dbfdd94827ed3a421eeeb7a19956','createIndex indexName=idx_expense_type, tableName=oa_expense','Add index for expense type queries',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('34','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:13',97,'EXECUTED','9:45748c8dcf2ff8f387a1d4e91362275d','createIndex indexName=idx_expense_date_deleted, tableName=oa_expense','Add index for expense date and deleted status',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('35','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:13',98,'EXECUTED','9:fe7de5b2309462da1a96ef544186a44d','createIndex indexName=idx_place_rent_payment_date, tableName=oa_place_rent_payment','Add index for place rent payments by date',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('36','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:13',99,'EXECUTED','9:60e1b4eda627ace352c6d00832ee2b0b','createIndex indexName=idx_place_rent_payment_date_deleted, tableName=oa_place_rent_payment','Add index for rent payment with deleted status',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('37','mohamed.ehab','changes/common/changeset-2026-07-14.xml','2026-07-17 00:10:13',100,'EXECUTED','9:586d514963a49cf84c7ec1bb48a49fb4','createIndex indexName=idx_enrollment_refund_date, tableName=oa_enrollment_refund','Add index for enrollment refunds by date',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/financial/_liquibase/changes/place/changeset-2026-07-15.xml','2026-07-17 00:10:13',101,'EXECUTED','9:91150fed39df7d1ada0d8211957e284a','addColumn tableName=oa_rent_type','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/employee/_liquibase/changes/changeset-2026-07-15.xml','2026-07-17 00:10:13',102,'EXECUTED','9:8e194f1648f0d5ae9117d3e0504f6019','addColumn tableName=oa_employee','',NULL,'4.27.0',NULL,NULL,'4236197021');
INSERT INTO `databasechangelog` VALUES ('1','mohamed.ehab','../../../service/enrollment/_liquibase/changes/changeset-2026-07-15.xml','2026-07-17 00:10:13',103,'EXECUTED','9:a6eb227730d24cd61335cee88be36fc8','addColumn tableName=oa_enrollment','',NULL,'4.27.0',NULL,NULL,'4236197021');
/*!40000 ALTER TABLE `databasechangelog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `databasechangeloglock`
--

DROP TABLE IF EXISTS `databasechangeloglock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `databasechangeloglock` (
  `ID` int NOT NULL,
  `LOCKED` tinyint NOT NULL,
  `LOCKGRANTED` datetime DEFAULT NULL,
  `LOCKEDBY` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `databasechangeloglock`
--

LOCK TABLES `databasechangeloglock` WRITE;
/*!40000 ALTER TABLE `databasechangeloglock` DISABLE KEYS */;
INSERT INTO `databasechangeloglock` VALUES (1,0,NULL,NULL);
/*!40000 ALTER TABLE `databasechangeloglock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fl_daily_counter`
--

DROP TABLE IF EXISTS `fl_daily_counter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fl_daily_counter` (
  `id` int NOT NULL,
  `count` int NOT NULL,
  `last_modified_on` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fl_daily_counter`
--

LOCK TABLES `fl_daily_counter` WRITE;
/*!40000 ALTER TABLE `fl_daily_counter` DISABLE KEYS */;
INSERT INTO `fl_daily_counter` VALUES (1,0,'2026-07-17');
/*!40000 ALTER TABLE `fl_daily_counter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fl_domain_config`
--

DROP TABLE IF EXISTS `fl_domain_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fl_domain_config` (
  `domain_id` int NOT NULL,
  `base_folder` varchar(20) DEFAULT NULL,
  `max_size` bigint DEFAULT NULL,
  `allowed_extensions` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `last_modified_on` datetime DEFAULT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  PRIMARY KEY (`domain_id`),
  CONSTRAINT `fk_fl_file_sc_domain` FOREIGN KEY (`domain_id`) REFERENCES `sc_domain` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fl_domain_config`
--

LOCK TABLES `fl_domain_config` WRITE;
/*!40000 ALTER TABLE `fl_domain_config` DISABLE KEYS */;
INSERT INTO `fl_domain_config` VALUES (4002,'/employee',10485760,'jpg,png,pdf','employee',NULL,NULL);
INSERT INTO `fl_domain_config` VALUES (5002,'/trainee',10485760,'jpg,png','trainee',NULL,NULL);
INSERT INTO `fl_domain_config` VALUES (5003,'/trainee_certificate',10485760,'jpg,png','trainee_certificate',NULL,NULL);
/*!40000 ALTER TABLE `fl_domain_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fl_file`
--

DROP TABLE IF EXISTS `fl_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fl_file` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `domain_id` int NOT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `fid` varchar(255) NOT NULL,
  `last_version` int DEFAULT NULL,
  `created_on` datetime DEFAULT (now()),
  `created_by_id` int DEFAULT NULL,
  `last_modified_on` datetime DEFAULT (now()),
  `last_modified_by_id` int DEFAULT NULL,
  `entity_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fid` (`fid`),
  KEY `fk_fl_file_domain_config` (`domain_id`),
  KEY `fk_fl_file_created_by_id` (`created_by_id`),
  KEY `fk_fl_file_last_modified_by_id` (`last_modified_by_id`),
  CONSTRAINT `fk_fl_file_created_by_id` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_fl_file_domain_config` FOREIGN KEY (`domain_id`) REFERENCES `fl_domain_config` (`domain_id`),
  CONSTRAINT `fk_fl_file_last_modified_by_id` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fl_file`
--

LOCK TABLES `fl_file` WRITE;
/*!40000 ALTER TABLE `fl_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `fl_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fl_file_version`
--

DROP TABLE IF EXISTS `fl_file_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fl_file_version` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file_id` bigint NOT NULL,
  `version` int NOT NULL,
  `size` bigint NOT NULL,
  `server_file_name` varchar(255) DEFAULT NULL,
  `server_location` varchar(255) DEFAULT NULL,
  `created_on` datetime DEFAULT (now()),
  `created_by_id` int DEFAULT NULL,
  `original_file_name` varchar(255) DEFAULT '',
  `fid_version` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_file_version` (`file_id`,`version`),
  KEY `fk_file_version_created_by_id` (`created_by_id`),
  CONSTRAINT `fk_file_version_created_by_id` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_file_version_fl_file` FOREIGN KEY (`file_id`) REFERENCES `fl_file` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fl_file_version`
--

LOCK TABLES `fl_file_version` WRITE;
/*!40000 ALTER TABLE `fl_file_version` DISABLE KEYS */;
/*!40000 ALTER TABLE `fl_file_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_constant`
--

DROP TABLE IF EXISTS `oa_constant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_constant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_id` int DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_constant_created_by` (`created_by_id`),
  CONSTRAINT `fk_constant_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_constant`
--

LOCK TABLES `oa_constant` WRITE;
/*!40000 ALTER TABLE `oa_constant` DISABLE KEYS */;
INSERT INTO `oa_constant` VALUES (1,'رقم الاكاديمي للطباعة','01002986930',NULL,'2026-06-29 08:38:59',1,NULL);
/*!40000 ALTER TABLE `oa_constant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_course`
--

DROP TABLE IF EXISTS `oa_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `department_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `duration` int DEFAULT NULL,
  `max_capacity` int NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `course_type` int DEFAULT NULL,
  `price` int DEFAULT NULL,
  `is_active` tinyint DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`),
  KEY `fk_course_created_by` (`created_by_id`),
  KEY `fk_course_modified_by` (`last_modified_by_id`),
  KEY `idx_course_department_active` (`department_id`,`is_active`),
  KEY `idx_course_dates_active` (`start_date`,`end_date`,`is_active`),
  CONSTRAINT `fk_course_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_course_department` FOREIGN KEY (`department_id`) REFERENCES `oa_department` (`id`),
  CONSTRAINT `fk_course_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_course`
--

LOCK TABLES `oa_course` WRITE;
/*!40000 ALTER TABLE `oa_course` DISABLE KEYS */;
INSERT INTO `oa_course` VALUES (2,2,'الكورس الشامل الطبي',NULL,1,100,'2026-06-19','2026-12-19',NULL,1,500,1,'2026-06-23 09:36:28','2026-06-30 03:14:51',1,1,0);
/*!40000 ALTER TABLE `oa_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_course_session`
--

DROP TABLE IF EXISTS `oa_course_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_course_session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(250) NOT NULL,
  `course_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `place_id` int NOT NULL,
  `session_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `status` int DEFAULT NULL,
  `note` text,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int DEFAULT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  `session_day` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_employee_course_session_day` (`employee_id`,`course_id`,`session_day`,`start_time`,`end_time`),
  KEY `fk_session_created_by` (`created_by_id`),
  KEY `fk_session_modified_by` (`last_modified_by_id`),
  KEY `idx_session_employee_day_time` (`employee_id`,`session_day`,`start_time`,`end_time`),
  KEY `idx_session_course_status` (`course_id`,`status`),
  KEY `idx_course_session_course_id` (`course_id`),
  KEY `idx_course_session_employee_id` (`employee_id`),
  KEY `idx_course_session_place_id` (`place_id`),
  CONSTRAINT `fk_session_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_session_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_course_session`
--

LOCK TABLES `oa_course_session` WRITE;
/*!40000 ALTER TABLE `oa_course_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `oa_course_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_department`
--

DROP TABLE IF EXISTS `oa_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` text,
  `is_active` tinyint DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`),
  KEY `fk_department_created_by` (`created_by_id`),
  KEY `fk_department_modified_by` (`last_modified_by_id`),
  CONSTRAINT `fk_department_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_department_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_department`
--

LOCK TABLES `oa_department` WRITE;
/*!40000 ALTER TABLE `oa_department` DISABLE KEYS */;
INSERT INTO `oa_department` VALUES (1,'السباحة','',1,'2026-06-19 09:59:04',NULL,1,NULL,0);
INSERT INTO `oa_department` VALUES (2,'الكورس الشامل','',1,'2026-06-20 13:16:14',NULL,1,NULL,0);
/*!40000 ALTER TABLE `oa_department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_employee`
--

DROP TABLE IF EXISTS `oa_employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(200) NOT NULL,
  `national_id` char(14) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` int DEFAULT NULL,
  `salary` int DEFAULT NULL,
  `remained_salary` int DEFAULT NULL,
  `salary_type` int DEFAULT NULL,
  `employee_type` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `is_active` tinyint DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  `is_monthly_updated` tinyint NOT NULL DEFAULT '0',
  `update_period_in_days` int NOT NULL DEFAULT '30',
  PRIMARY KEY (`id`),
  UNIQUE KEY `national_id` (`national_id`),
  KEY `fk_employee_created_by` (`created_by_id`),
  KEY `fk_employee_modified_by` (`last_modified_by_id`),
  KEY `idx_employee_active` (`is_active`),
  KEY `idx_employee_type_active` (`employee_type`,`is_active`),
  CONSTRAINT `fk_employee_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_employee_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_employee`
--

LOCK TABLES `oa_employee` WRITE;
/*!40000 ALTER TABLE `oa_employee` DISABLE KEYS */;
INSERT INTO `oa_employee` VALUES (1,'محمد ايهاب','30202102300714','2002-02-09',1,8000,8000,1,1,'400226061900001','2026-06-18',1,'2026-06-21 14:55:31','2026-06-23 18:24:13',1,1,0,0,30);
INSERT INTO `oa_employee` VALUES (3,'مريم الديب','01557044587',NULL,2,500,0,3,1,NULL,'2026-06-20',1,'2026-06-22 14:44:20','2026-06-25 17:30:22',1,1,0,0,30);
INSERT INTO `oa_employee` VALUES (4,'محمد البحار','01008518006',NULL,1,500,500,3,1,'400226062200001','2026-06-21',1,'2026-06-22 14:44:20','2026-06-22 14:37:56',1,1,0,0,30);
INSERT INTO `oa_employee` VALUES (5,'ك حبيبة','01022967914',NULL,2,500,500,3,1,NULL,'2026-06-21',1,'2026-06-22 14:44:20','2026-06-22 15:05:19',1,1,0,0,30);
INSERT INTO `oa_employee` VALUES (6,'ك باسل','01018943585',NULL,1,500,500,3,1,NULL,'2026-06-21',1,'2026-06-22 14:44:20','2026-06-22 15:19:03',1,1,0,0,30);
INSERT INTO `oa_employee` VALUES (7,'ك احمد رجب','01069825907',NULL,1,500,500,3,1,NULL,'2026-06-21',1,'2026-06-22 14:44:20','2026-06-22 15:21:43',1,1,0,0,30);
INSERT INTO `oa_employee` VALUES (8,'ك اسماء حمد','01154427999',NULL,2,500,500,3,1,NULL,'2026-06-21',1,'2026-06-22 14:44:20','2026-06-22 15:28:19',1,1,0,0,30);
INSERT INTO `oa_employee` VALUES (9,'ك هايدي','01024503846',NULL,2,500,500,3,1,NULL,'2026-06-21',1,'2026-06-22 14:44:20','2026-06-22 15:30:16',1,1,0,0,30);
INSERT INTO `oa_employee` VALUES (10,'ك زينب','01066940535',NULL,2,500,500,3,1,NULL,'2026-06-21',1,'2026-06-22 14:44:20','2026-06-22 15:31:46',1,1,0,0,30);
INSERT INTO `oa_employee` VALUES (11,'محمد بريد','01006157460',NULL,1,500,500,3,1,NULL,'2026-06-21',1,'2026-06-22 14:44:20','2026-06-22 15:35:43',1,1,0,0,30);
INSERT INTO `oa_employee` VALUES (12,'ك عبدالله مصطفي','30202102300521',NULL,1,500,500,3,1,NULL,'2026-06-22',1,'2026-06-22 14:44:20','2026-06-22 15:35:43',1,1,0,0,30);
INSERT INTO `oa_employee` VALUES (13,'ك بسنت','01069955544',NULL,2,500,500,3,1,NULL,'2026-06-22',1,'2026-06-22 14:44:20','2026-06-22 15:35:43',1,1,0,0,30);
/*!40000 ALTER TABLE `oa_employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_employee_attendance`
--

DROP TABLE IF EXISTS `oa_employee_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_employee_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `attendance_date` date NOT NULL,
  `status` int NOT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `late_time` int DEFAULT NULL,
  `note` text,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_employee_attendance_created_by` (`created_by_id`),
  KEY `fk_employee_attendance_modified_by` (`last_modified_by_id`),
  KEY `idx_emp_attendance_employee_date` (`employee_id`,`attendance_date`),
  CONSTRAINT `fk_employee_attendance_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_employee_attendance_employee` FOREIGN KEY (`employee_id`) REFERENCES `oa_employee` (`id`),
  CONSTRAINT `fk_employee_attendance_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_employee_attendance`
--

LOCK TABLES `oa_employee_attendance` WRITE;
/*!40000 ALTER TABLE `oa_employee_attendance` DISABLE KEYS */;
INSERT INTO `oa_employee_attendance` VALUES (1,1,'2026-06-24',1,'10:00:00','15:00:00',NULL,NULL,'2026-06-24 07:36:16','2026-06-30 03:12:33',1,1,1);
/*!40000 ALTER TABLE `oa_employee_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_employee_contact`
--

DROP TABLE IF EXISTS `oa_employee_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_employee_contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `contact_type` int DEFAULT NULL,
  `contact_value` varchar(255) NOT NULL,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int DEFAULT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_emp_contact_created_by` (`created_by_id`),
  KEY `fk_emp_contact_modified_by` (`last_modified_by_id`),
  KEY `idx_employee_contact_value` (`contact_value`),
  KEY `idx_employee_contact_type` (`employee_id`,`contact_type`),
  CONSTRAINT `fk_emp_contact_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_emp_contact_employee` FOREIGN KEY (`employee_id`) REFERENCES `oa_employee` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_emp_contact_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_employee_contact`
--

LOCK TABLES `oa_employee_contact` WRITE;
/*!40000 ALTER TABLE `oa_employee_contact` DISABLE KEYS */;
INSERT INTO `oa_employee_contact` VALUES (2,1,2,'01069911181','2026-06-19 16:00:27',NULL,1,NULL,NULL);
INSERT INTO `oa_employee_contact` VALUES (3,3,2,'01557044587','2026-06-21 13:55:07',NULL,1,NULL,NULL);
INSERT INTO `oa_employee_contact` VALUES (4,4,2,'01008518006','2026-06-22 14:37:06',NULL,1,NULL,NULL);
INSERT INTO `oa_employee_contact` VALUES (5,5,2,'01022967914','2026-06-22 15:05:01',NULL,1,NULL,NULL);
INSERT INTO `oa_employee_contact` VALUES (6,6,2,'01018943585','2026-06-22 15:15:59',NULL,1,NULL,NULL);
INSERT INTO `oa_employee_contact` VALUES (7,7,2,'01069825907','2026-06-22 15:21:22',NULL,1,NULL,NULL);
INSERT INTO `oa_employee_contact` VALUES (8,8,2,'01154427999','2026-06-22 15:28:02',NULL,1,NULL,NULL);
INSERT INTO `oa_employee_contact` VALUES (9,9,2,'01024503846','2026-06-22 15:30:05',NULL,1,NULL,NULL);
INSERT INTO `oa_employee_contact` VALUES (10,10,2,'01066940535','2026-06-22 15:31:33',NULL,1,NULL,NULL);
INSERT INTO `oa_employee_contact` VALUES (11,11,2,'01006157460','2026-06-22 15:35:29',NULL,1,NULL,NULL);
/*!40000 ALTER TABLE `oa_employee_contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_employee_department`
--

DROP TABLE IF EXISTS `oa_employee_department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_employee_department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `department_id` int NOT NULL,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_employee_department_created_by` (`created_by_id`),
  KEY `fk_employee_department_department` (`department_id`),
  KEY `idx_emp_dept_employee_department` (`employee_id`,`department_id`),
  CONSTRAINT `fk_employee_department_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_employee_department_department` FOREIGN KEY (`department_id`) REFERENCES `oa_department` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_employee_department_employee` FOREIGN KEY (`employee_id`) REFERENCES `oa_employee` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_employee_department`
--

LOCK TABLES `oa_employee_department` WRITE;
/*!40000 ALTER TABLE `oa_employee_department` DISABLE KEYS */;
INSERT INTO `oa_employee_department` VALUES (1,1,1,'2026-06-19 10:07:13',1);
INSERT INTO `oa_employee_department` VALUES (2,3,1,'2026-06-21 13:45:47',1);
INSERT INTO `oa_employee_department` VALUES (3,4,1,'2026-06-22 14:18:36',1);
INSERT INTO `oa_employee_department` VALUES (4,5,1,'2026-06-22 15:05:01',1);
INSERT INTO `oa_employee_department` VALUES (5,6,1,'2026-06-22 15:15:59',1);
INSERT INTO `oa_employee_department` VALUES (6,7,1,'2026-06-22 15:21:07',1);
INSERT INTO `oa_employee_department` VALUES (7,8,1,'2026-06-22 15:28:02',1);
INSERT INTO `oa_employee_department` VALUES (8,9,1,'2026-06-22 15:30:05',1);
INSERT INTO `oa_employee_department` VALUES (9,10,1,'2026-06-22 15:31:33',1);
INSERT INTO `oa_employee_department` VALUES (10,11,1,'2026-06-22 15:35:29',1);
INSERT INTO `oa_employee_department` VALUES (11,12,1,'2026-06-22 18:16:39',1);
INSERT INTO `oa_employee_department` VALUES (12,13,1,'2026-06-22 18:21:35',1);
/*!40000 ALTER TABLE `oa_employee_department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_enrollment`
--

DROP TABLE IF EXISTS `oa_enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_enrollment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainee_id` int NOT NULL,
  `course_id` int NOT NULL,
  `trainer_id` int NOT NULL,
  `enrollment_type_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `enrollment_status` int DEFAULT NULL,
  `payment_status` int DEFAULT NULL,
  `subscription_value` int DEFAULT NULL,
  `discount_amount` int DEFAULT '0',
  `discount_percentage` decimal(5,2) DEFAULT '0.00',
  `final_subscription_value` int DEFAULT NULL,
  `remained_subscription_value` int DEFAULT NULL,
  `note` text,
  `is_active` tinyint DEFAULT '1',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  `is_auto_update` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_trainee_course` (`trainee_id`,`course_id`,`enrollment_type_id`,`start_date`),
  KEY `fk_enrollment_type` (`enrollment_type_id`),
  KEY `fk_enrollment_created_by` (`created_by_id`),
  KEY `fk_enrollment_modified_by` (`last_modified_by_id`),
  KEY `idx_enrollment_trainee_status` (`trainee_id`,`enrollment_status`,`is_active`),
  KEY `idx_enrollment_course_dates` (`course_id`,`start_date`,`end_date`),
  KEY `idx_enrollment_payment_status` (`payment_status`,`is_active`),
  KEY `idx_enrollment_trainer_active` (`trainer_id`,`is_active`),
  KEY `idx_enrollment_created_active` (`created_on`,`is_active`,`is_deleted`),
  KEY `idx_enrollment_created_status` (`created_on`,`enrollment_status`,`is_deleted`),
  CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_id`) REFERENCES `oa_course` (`id`),
  CONSTRAINT `fk_enrollment_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_enrollment_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_enrollment_trainee` FOREIGN KEY (`trainee_id`) REFERENCES `oa_trainee` (`id`),
  CONSTRAINT `fk_enrollment_trainer` FOREIGN KEY (`trainer_id`) REFERENCES `oa_employee` (`id`),
  CONSTRAINT `fk_enrollment_type` FOREIGN KEY (`enrollment_type_id`) REFERENCES `oa_enrollment_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_enrollment`
--

LOCK TABLES `oa_enrollment` WRITE;
/*!40000 ALTER TABLE `oa_enrollment` DISABLE KEYS */;
INSERT INTO `oa_enrollment` VALUES (2,5,2,1,1,'2026-06-19','2026-06-29',1,6,500,0,0.00,500,500,'',1,'2026-06-19 21:07:27','2026-06-23 18:13:53',1,1,0,0);
INSERT INTO `oa_enrollment` VALUES (3,24,2,1,1,'2026-06-19','2026-06-29',1,6,500,0,0.00,500,500,'',1,'2026-06-19 21:07:27','2026-06-29 10:12:48',1,1,0,0);
INSERT INTO `oa_enrollment` VALUES (4,7,2,3,1,'2026-06-19','2026-12-16',1,6,500,0,0.00,500,500,'',1,'2026-06-23 09:20:24','2026-07-02 06:02:54',1,1,0,0);
INSERT INTO `oa_enrollment` VALUES (5,25,2,3,1,'2026-06-19','2026-12-15',1,6,500,0,0.00,500,500,'',1,'2026-06-23 13:52:19','2026-07-02 06:03:09',1,1,0,0);
INSERT INTO `oa_enrollment` VALUES (6,26,2,3,1,'2026-06-19','2026-12-14',1,6,500,0,0.00,500,500,'',1,'2026-06-23 15:15:28','2026-06-29 10:13:24',1,1,0,0);
INSERT INTO `oa_enrollment` VALUES (7,27,2,3,1,'2026-06-19','2026-12-15',1,6,500,0,0.00,500,500,'',1,'2026-06-23 15:26:38','2026-06-29 10:13:35',1,1,0,0);
INSERT INTO `oa_enrollment` VALUES (8,31,2,3,1,'2026-06-19','2026-12-18',1,6,500,0,0.00,500,500,'',1,'2026-06-23 19:54:13',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (9,29,2,3,1,'2026-06-19','2026-12-18',1,6,500,0,0.00,500,500,'',1,'2026-06-23 20:00:14',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (10,30,2,3,1,'2026-06-19','2026-12-18',1,6,500,0,0.00,500,500,'',1,'2026-06-23 20:00:58',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (11,32,2,3,1,'2026-06-19','2026-12-18',1,6,500,0,0.00,500,500,'',1,'2026-06-23 20:03:07',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (12,33,2,3,1,'2026-06-19','2026-12-18',1,6,500,0,0.00,500,500,'',1,'2026-06-23 20:04:44',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (13,34,2,3,1,'2026-06-19','2026-12-18',3,4,500,0,0.00,500,0,'',1,'2026-06-23 20:06:28','2026-06-29 13:09:09',1,1,0,0);
INSERT INTO `oa_enrollment` VALUES (14,35,2,3,1,'2026-06-19','2026-12-15',1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:34:16',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (15,36,2,3,1,'2026-06-19','2026-12-15',1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:36:02','2026-06-25 19:36:28',1,1,0,0);
INSERT INTO `oa_enrollment` VALUES (16,37,2,3,1,'2026-06-19','2026-12-15',1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:38:08',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (17,38,2,3,1,'2026-06-19','2026-12-15',1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:39:33',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (18,39,2,3,1,'2026-06-19','2026-12-15',1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:41:12',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (19,40,2,3,1,'2026-06-19','2026-12-14',1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:43:10',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (20,41,2,3,1,'2026-06-19','2026-12-15',1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:44:33',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (21,42,2,3,1,'2026-06-19','2026-12-15',1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:46:12',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (22,43,2,3,1,'2026-06-19','2026-12-14',1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:48:14',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (23,44,2,3,1,'2026-06-19','2026-12-15',1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:49:51',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (24,45,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:53:09',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (25,46,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:54:31',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (26,47,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-25 19:56:50',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (27,49,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 10:50:54',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (28,50,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 10:52:19',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (29,51,2,3,1,'2026-06-22',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 10:53:38',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (30,52,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 10:54:45',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (31,53,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 10:55:52',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (32,54,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 10:57:05',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (33,55,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 10:58:33',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (34,56,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 10:59:46',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (35,57,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 11:00:48',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (36,59,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:28:49',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (37,60,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:31:02',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (38,61,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:32:53',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (39,62,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:34:22',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (40,63,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:35:49',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (41,64,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:37:02',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (42,65,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:38:26',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (43,66,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:39:34',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (44,67,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:42:23',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (45,68,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:43:34',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (46,69,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:44:42',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (47,70,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:45:43',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (48,71,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:46:56',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (49,72,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:48:19',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (50,73,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:49:34',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (51,74,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:50:48',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (52,75,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:51:52',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (53,76,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:54:45',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (54,77,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 14:56:11',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (55,6,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:11:59',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (56,8,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:13:35',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (57,9,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:14:50',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (58,10,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:15:38',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (59,11,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:16:20',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (60,12,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:16:52',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (61,13,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:17:38',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (62,14,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:18:17',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (63,15,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:19:01',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (64,16,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:19:57',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (65,17,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:20:44',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (66,78,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:22:34',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (67,18,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:23:30',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (68,19,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:24:05',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (69,20,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:24:40',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (70,21,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:25:16',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (71,22,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:25:59',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (72,79,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:27:36',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (73,80,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:28:38',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (74,81,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:30:44',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (75,82,2,3,1,'2026-06-22',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:33:07',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (76,83,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:34:17',NULL,1,NULL,0,0);
INSERT INTO `oa_enrollment` VALUES (77,84,2,3,1,'2026-06-19',NULL,1,6,500,0,0.00,500,500,'',1,'2026-06-26 16:35:49',NULL,1,NULL,0,0);
/*!40000 ALTER TABLE `oa_enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_enrollment_payment`
--

DROP TABLE IF EXISTS `oa_enrollment_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_enrollment_payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrollment_id` int NOT NULL,
  `payment_date` date DEFAULT NULL,
  `paid_amount` int DEFAULT NULL,
  `enrollment_value` int DEFAULT NULL,
  `remained_value` int DEFAULT NULL,
  `payment_method_id` int DEFAULT NULL,
  `image_url` varchar(250) DEFAULT NULL,
  `note` text,
  `payment_status` int DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_enrollment_payment_enrollment` (`enrollment_id`),
  KEY `fk_enrollment_payment_payment_method` (`payment_method_id`),
  KEY `fk_enrollment_payment_created_by` (`created_by_id`),
  KEY `fk_enrollment_payment_modified_by` (`last_modified_by_id`),
  KEY `idx_enrollment_payment_date` (`payment_date`),
  KEY `idx_enrollment_payment_status` (`payment_status`),
  CONSTRAINT `fk_enrollment_payment_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_enrollment_payment_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `oa_enrollment` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enrollment_payment_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_enrollment_payment_payment_method` FOREIGN KEY (`payment_method_id`) REFERENCES `oa_payment_method` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_enrollment_payment`
--

LOCK TABLES `oa_enrollment_payment` WRITE;
/*!40000 ALTER TABLE `oa_enrollment_payment` DISABLE KEYS */;
INSERT INTO `oa_enrollment_payment` VALUES (1,13,'2026-06-24',500,500,0,1,NULL,'',2,'2026-06-24 08:23:44','2026-07-02 06:03:26',1,1,1);
/*!40000 ALTER TABLE `oa_enrollment_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_enrollment_refund`
--

DROP TABLE IF EXISTS `oa_enrollment_refund`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_enrollment_refund` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrollment_id` int NOT NULL,
  `refund_date` date DEFAULT NULL,
  `amount_refunded` int DEFAULT NULL,
  `payment_method_id` int DEFAULT NULL,
  `image_url` varchar(250) DEFAULT NULL,
  `note` text,
  `refund_status` int DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_enrollment_refund_enrollment` (`enrollment_id`),
  KEY `fk_enrollment_refund_payment_method` (`payment_method_id`),
  KEY `fk_enrollment_refund_created_by` (`created_by_id`),
  KEY `fk_enrollment_refund_modified_by` (`last_modified_by_id`),
  KEY `idx_enrollment_refund_date` (`refund_date`,`is_deleted`),
  CONSTRAINT `fk_enrollment_refund_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_enrollment_refund_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `oa_enrollment` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enrollment_refund_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_enrollment_refund_payment_method` FOREIGN KEY (`payment_method_id`) REFERENCES `oa_payment_method` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_enrollment_refund`
--

LOCK TABLES `oa_enrollment_refund` WRITE;
/*!40000 ALTER TABLE `oa_enrollment_refund` DISABLE KEYS */;
INSERT INTO `oa_enrollment_refund` VALUES (1,13,'2026-06-29',500,1,NULL,'',4,'2026-06-29 13:09:09',NULL,1,NULL,0);
/*!40000 ALTER TABLE `oa_enrollment_refund` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_enrollment_type`
--

DROP TABLE IF EXISTS `oa_enrollment_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_enrollment_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(250) NOT NULL,
  `description` text,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_enrollment_type`
--

LOCK TABLES `oa_enrollment_type` WRITE;
/*!40000 ALTER TABLE `oa_enrollment_type` DISABLE KEYS */;
INSERT INTO `oa_enrollment_type` VALUES (1,'عادي','','2026-06-19 21:07:16',1,0);
/*!40000 ALTER TABLE `oa_enrollment_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_expense`
--

DROP TABLE IF EXISTS `oa_expense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_expense` (
  `id` int NOT NULL AUTO_INCREMENT,
  `expense_date` date DEFAULT NULL,
  `amount_expensed` int DEFAULT NULL,
  `payment_method_id` int DEFAULT NULL,
  `expense_type_id` int DEFAULT NULL,
  `images_urls` json DEFAULT NULL,
  `note` text,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_expense_payment_method` (`payment_method_id`),
  KEY `fk_expense_created_by` (`created_by_id`),
  KEY `fk_expense_modified_by` (`last_modified_by_id`),
  KEY `idx_expense_date` (`expense_date`),
  KEY `idx_expense_type` (`expense_type_id`),
  KEY `idx_expense_date_deleted` (`expense_date`,`is_deleted`),
  CONSTRAINT `fk_expense_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_expense_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_expense_payment_method` FOREIGN KEY (`payment_method_id`) REFERENCES `oa_payment_method` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_expense`
--

LOCK TABLES `oa_expense` WRITE;
/*!40000 ALTER TABLE `oa_expense` DISABLE KEYS */;
INSERT INTO `oa_expense` VALUES (1,'2026-06-29',500,1,1,'[]','','2026-06-29 14:10:24','2026-07-02 06:03:42',1,1,1);
/*!40000 ALTER TABLE `oa_expense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_expense_type`
--

DROP TABLE IF EXISTS `oa_expense_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_expense_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(250) NOT NULL,
  `description` text,
  `is_active` tinyint DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_id` int NOT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_expense_type_created_by` (`created_by_id`),
  CONSTRAINT `fk_expense_type_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_expense_type`
--

LOCK TABLES `oa_expense_type` WRITE;
/*!40000 ALTER TABLE `oa_expense_type` DISABLE KEYS */;
INSERT INTO `oa_expense_type` VALUES (1,'كهرباء','',1,'2026-06-29 14:10:00',1,0);
/*!40000 ALTER TABLE `oa_expense_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_health_condition`
--

DROP TABLE IF EXISTS `oa_health_condition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_health_condition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainee_id` int NOT NULL,
  `title` varchar(250) NOT NULL,
  `description` text,
  `medication` varchar(250) DEFAULT NULL,
  `note` text,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int DEFAULT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_health_condition_trainee` (`trainee_id`),
  KEY `fk_health_condition_created_by` (`created_by_id`),
  KEY `fk_health_condition_modified_by` (`last_modified_by_id`),
  CONSTRAINT `fk_health_condition_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_health_condition_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_health_condition_trainee` FOREIGN KEY (`trainee_id`) REFERENCES `oa_trainee` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_health_condition`
--

LOCK TABLES `oa_health_condition` WRITE;
/*!40000 ALTER TABLE `oa_health_condition` DISABLE KEYS */;
/*!40000 ALTER TABLE `oa_health_condition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_payment_method`
--

DROP TABLE IF EXISTS `oa_payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_payment_method` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(250) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_payment_method`
--

LOCK TABLES `oa_payment_method` WRITE;
/*!40000 ALTER TABLE `oa_payment_method` DISABLE KEYS */;
INSERT INTO `oa_payment_method` VALUES (1,'كاش','2026-06-24 08:12:57',1);
/*!40000 ALTER TABLE `oa_payment_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_place`
--

DROP TABLE IF EXISTS `oa_place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_place` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(250) NOT NULL,
  `rent_value` int DEFAULT NULL,
  `remained_value` int DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_place_created_by` (`created_by_id`),
  KEY `fk_place_modified_by` (`last_modified_by_id`),
  CONSTRAINT `fk_place_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_place_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_place`
--

LOCK TABLES `oa_place` WRITE;
/*!40000 ALTER TABLE `oa_place` DISABLE KEYS */;
/*!40000 ALTER TABLE `oa_place` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_place_rent_payment`
--

DROP TABLE IF EXISTS `oa_place_rent_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_place_rent_payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `place_id` int NOT NULL,
  `rent_amount` int DEFAULT NULL,
  `payed_amount` int DEFAULT NULL,
  `remained_amount` int DEFAULT NULL,
  `rent_type_id` int DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `payment_method_id` int DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_place_rent_payment_rent_type` (`rent_type_id`),
  KEY `fk_place_rent_payment_place` (`place_id`),
  KEY `fk_place_rent_payment_payment_method` (`payment_method_id`),
  KEY `fk_place_rent_payment_created_by` (`created_by_id`),
  KEY `fk_place_rent_payment_modified_by` (`last_modified_by_id`),
  KEY `idx_place_rent_payment_date` (`payment_date`),
  KEY `idx_place_rent_payment_date_deleted` (`payment_date`,`is_deleted`),
  CONSTRAINT `fk_place_rent_payment_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_place_rent_payment_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_place_rent_payment_payment_method` FOREIGN KEY (`payment_method_id`) REFERENCES `oa_payment_method` (`id`),
  CONSTRAINT `fk_place_rent_payment_place` FOREIGN KEY (`place_id`) REFERENCES `oa_place` (`id`),
  CONSTRAINT `fk_place_rent_payment_rent_type` FOREIGN KEY (`rent_type_id`) REFERENCES `oa_rent_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_place_rent_payment`
--

LOCK TABLES `oa_place_rent_payment` WRITE;
/*!40000 ALTER TABLE `oa_place_rent_payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `oa_place_rent_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_rent_type`
--

DROP TABLE IF EXISTS `oa_rent_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_rent_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_id` int NOT NULL,
  `is_deleted` tinyint DEFAULT '0',
  `effect` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_rent_type_created_by` (`created_by_id`),
  CONSTRAINT `fk_rent_type_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_rent_type`
--

LOCK TABLES `oa_rent_type` WRITE;
/*!40000 ALTER TABLE `oa_rent_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `oa_rent_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_salary_deduction`
--

DROP TABLE IF EXISTS `oa_salary_deduction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_salary_deduction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `deduction_date` date DEFAULT NULL,
  `amount_deducted` int DEFAULT NULL,
  `image_url` varchar(250) DEFAULT NULL,
  `reason` text,
  `salary_type` int DEFAULT NULL,
  `deduction_type` int DEFAULT NULL,
  `note` text,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_salary_deduction_created_by` (`created_by_id`),
  KEY `fk_salary_deduction_modified_by` (`last_modified_by_id`),
  KEY `idx_salary_deduction_emp_date` (`employee_id`,`deduction_date`),
  CONSTRAINT `fk_salary_deduction_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_salary_deduction_employee` FOREIGN KEY (`employee_id`) REFERENCES `oa_employee` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_salary_deduction_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_salary_deduction`
--

LOCK TABLES `oa_salary_deduction` WRITE;
/*!40000 ALTER TABLE `oa_salary_deduction` DISABLE KEYS */;
/*!40000 ALTER TABLE `oa_salary_deduction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_salary_incentive`
--

DROP TABLE IF EXISTS `oa_salary_incentive`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_salary_incentive` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `withdraw_date` date DEFAULT NULL,
  `amount_withdrawn` int DEFAULT NULL,
  `payment_method_id` int DEFAULT NULL,
  `image_url` varchar(250) DEFAULT NULL,
  `salary_type` int DEFAULT NULL,
  `salary_transaction_type` int DEFAULT NULL,
  `note` text,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_salary_incentive_payment_method` (`payment_method_id`),
  KEY `fk_salary_incentive_created_by` (`created_by_id`),
  KEY `fk_salary_incentive_modified_by` (`last_modified_by_id`),
  KEY `idx_salary_incentive_emp_date` (`employee_id`,`withdraw_date`),
  KEY `idx_salary_incentive_date_type` (`withdraw_date`,`salary_transaction_type`,`is_deleted`),
  KEY `idx_salary_incentive_emp_type_date` (`employee_id`,`salary_transaction_type`,`withdraw_date`),
  CONSTRAINT `fk_salary_incentive_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_salary_incentive_employee` FOREIGN KEY (`employee_id`) REFERENCES `oa_employee` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_salary_incentive_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_salary_incentive_payment_method` FOREIGN KEY (`payment_method_id`) REFERENCES `oa_payment_method` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_salary_incentive`
--

LOCK TABLES `oa_salary_incentive` WRITE;
/*!40000 ALTER TABLE `oa_salary_incentive` DISABLE KEYS */;
INSERT INTO `oa_salary_incentive` VALUES (1,3,'2026-06-25',500,1,NULL,3,1,'','2026-06-25 17:30:22','2026-07-02 06:03:56',1,1,1);
/*!40000 ALTER TABLE `oa_salary_incentive` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_token`
--

DROP TABLE IF EXISTS `oa_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(500) DEFAULT NULL,
  `token_type` varchar(50) NOT NULL,
  `user_id` int DEFAULT NULL,
  `expiry_date` timestamp NULL DEFAULT NULL,
  `is_used` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_user_token` (`user_id`),
  CONSTRAINT `fk_user_token` FOREIGN KEY (`user_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_token`
--

LOCK TABLES `oa_token` WRITE;
/*!40000 ALTER TABLE `oa_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `oa_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_trainee`
--

DROP TABLE IF EXISTS `oa_trainee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_trainee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(200) NOT NULL,
  `national_id` varchar(20) NOT NULL,
  `academic_year` varchar(50) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` int DEFAULT NULL,
  `address` text,
  `image_url` varchar(250) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_active` tinyint DEFAULT '1',
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `national_id` (`national_id`),
  KEY `fk_trainee_created_by` (`created_by_id`),
  KEY `fk_trainee_modified_by` (`last_modified_by_id`),
  KEY `idx_trainee_active` (`is_active`),
  CONSTRAINT `fk_trainee_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_trainee_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_trainee`
--

LOCK TABLES `oa_trainee` WRITE;
/*!40000 ALTER TABLE `oa_trainee` DISABLE KEYS */;
INSERT INTO `oa_trainee` VALUES (5,'اسراء محمد عبدالتواب','01103352843',NULL,NULL,2,'الفيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:26:05',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (6,'امنية خالد قرني','01070678864','حجامة',NULL,2,'',NULL,'2026-06-20 10:08:27','2026-06-26 16:11:00',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (7,'سما خلف احمد','01091151856',NULL,NULL,2,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:36:52',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (8,'ايمان فتحي شعبان','01065651980',NULL,NULL,2,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:37:37',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (9,'روان عبدالتواب','30202102300759',NULL,NULL,2,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:38:01',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (10,'ايات رجب عبدالحليم','01012941047',NULL,NULL,2,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:38:53',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (11,'دعاء فتحي عيد','30202102300722',NULL,NULL,2,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:39:15',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (12,'شهد حميدة','30202102300733',NULL,NULL,2,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:39:40',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (13,'هاجر حسين احمد','01101486785','2',NULL,2,'',NULL,'2026-06-20 10:08:27','2026-06-26 14:53:44',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (14,'مريم عجمي','01061062904',NULL,NULL,2,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:40:27',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (15,'اميرة سيد جمعة','01004583286',NULL,NULL,2,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:40:48',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (16,'نسمة ممدوح فتحي','01030350853',NULL,NULL,2,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:41:10',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (17,'احمد محمد عويس','01122751270',NULL,NULL,1,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:35:25',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (18,'يوسف رجب عبدالرحمان','01122025584',NULL,NULL,1,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:35:43',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (19,'روان بدوي محمد','01116378125',NULL,NULL,2,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:41:35',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (20,'امال احمد محمد','01104378235',NULL,NULL,2,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:41:57',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (21,'عمر عبدالرحمن عبدالرحيم','01014906191',NULL,NULL,1,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:42:23',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (22,'عبدالرحمن الهواري','01096961309',NULL,NULL,1,'فيوم',NULL,'2026-06-20 10:08:27','2026-06-20 14:42:46',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (23,'شروق احمد هاشم','01015052713','1',NULL,2,'فيوم',NULL,'2026-06-20 14:22:06',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (24,'نوال محمد موسي','01116237539',NULL,NULL,2,'فيوم',NULL,'2026-06-20 15:23:12',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (25,'حسناء اسلام علي مصطفي','01030053716','رابعة-سباحة',NULL,2,'فيوم',NULL,'2026-06-23 13:51:42',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (26,'اماني احمد كامل محمد','01015094389','1',NULL,2,'فيوم',NULL,'2026-06-23 15:14:48',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (27,'ليلي احمد عبدالحفيظ','01068282945','1',NULL,2,'فيوم',NULL,'2026-06-23 15:25:56',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (29,'سيف ياسر محمود','01094207970','1',NULL,2,'فيوم',NULL,'2026-06-23 15:37:02',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (30,'عبدالله محمد السيد','01289092076','1',NULL,1,'',NULL,'2026-06-23 15:38:42','2026-06-23 20:07:12',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (31,'بسنت علاء الدين','01000192954','1',NULL,2,'فيوم',NULL,'2026-06-23 19:53:15',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (32,'ايمان يحي','01070511467','1',NULL,2,'فيوم',NULL,'2026-06-23 20:02:33',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (33,'يوسف محمود احمد','01025205684','1',NULL,1,'',NULL,'2026-06-23 20:04:12','2026-06-23 20:06:47',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (34,'يوسف ياسر احمد','01010486106','1',NULL,1,'فيوم',NULL,'2026-06-23 20:06:01',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (35,'رحمة حسن حافظ','01006985108','1',NULL,2,'فيوم',NULL,'2026-06-25 19:33:25',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (36,'رحمة محمود السيد','01011089239','1',NULL,2,'فيوم',NULL,'2026-06-25 19:35:30',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (37,'عبدالله عماد العاطي','01009910342','1',NULL,1,'فيوم',NULL,'2026-06-25 19:37:36',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (38,'نوال محمد موسي','01008899582','1',NULL,2,'فيوم',NULL,'2026-06-25 19:38:57',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (39,'ندي محمد رشاد ','01016082191','1',NULL,2,'فيوم',NULL,'2026-06-25 19:40:40',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (40,'ندي محمد عبدالسلام','01115628605','1',NULL,2,'فيوم',NULL,'2026-06-25 19:42:30',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (41,'سندس حجازي محمد','01019027791','1',NULL,2,'فيوم',NULL,'2026-06-25 19:44:02',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (42,'حبيبة عصام هاشم','01120932927','1',NULL,2,'فيوم',NULL,'2026-06-25 19:45:28',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (43,'حبيبة عاشور عبدالقادر','01554404546','1',NULL,2,'فيوم',NULL,'2026-06-25 19:47:45',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (44,'مريم احمد علي احمد','01555374954','1',NULL,2,'فيوم',NULL,'2026-06-25 19:48:59',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (45,'عبدالرحمن عمر شوقي','01040784111','1',NULL,1,'فيوم',NULL,'2026-06-25 19:52:38',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (46,'امنية سيد فتحي','01128768344','1',NULL,2,'فيوم',NULL,'2026-06-25 19:54:00',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (47,'شروق احمد هاشم','01015057213','1',NULL,2,'فيوم',NULL,'2026-06-25 19:55:14',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (48,'فيروز لطفي عبدالرحمن','01050708162','1',NULL,2,'فيوم',NULL,'2026-06-26 10:29:59',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (49,'اسراء محمود عبدالله ','01092477242','مجموعة الاحد',NULL,2,'فيوم',NULL,'2026-06-26 10:50:25',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (50,'اية محمود فؤاد','01110898061','3',NULL,2,'فيوم',NULL,'2026-06-26 10:52:02',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (51,'يوسف عبدالحكيم اسماعيل','01123429207','1',NULL,1,'فيوم',NULL,'2026-06-26 10:53:05',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (52,'العايم رجب العايم','01034112430','1',NULL,1,'فيوم',NULL,'2026-06-26 10:54:29',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (53,'مريم تامر رجب','01120259008','2',NULL,2,'فيوم',NULL,'2026-06-26 10:55:36',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (54,'ملك عماد عبدالله','01040602201','1',NULL,2,'فيوم',NULL,'2026-06-26 10:56:45',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (55,'حنين حمدي محمد','01050110592','1',NULL,2,'فيوم',NULL,'2026-06-26 10:58:17',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (56,'رودينا تامر فوزي','01105838401','2',NULL,2,'فيوم',NULL,'2026-06-26 10:59:30',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (57,'عبدالله عماد سعد ','01095459576','4',NULL,1,'فيوم',NULL,'2026-06-26 11:00:34',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (58,'جني محمد مولي','0102866001','1',NULL,2,'فيوم',NULL,'2026-06-26 11:02:12',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (59,'جني هاني عادل','01092225851','1',NULL,2,'فيوم',NULL,'2026-06-26 14:28:19',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (60,'جني عادل محمد ','01029088932','1',NULL,2,'فيوم',NULL,'2026-06-26 14:30:34',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (61,'جني محمد رجائي ','01140764808','1',NULL,2,'فيوم',NULL,'2026-06-26 14:32:27',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (62,'سهام احمد محمد','01030842796','3',NULL,2,'فيوم',NULL,'2026-06-26 14:34:02',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (63,'اسماء شريف حسن','01019624043','1',NULL,2,'',NULL,'2026-06-26 14:35:27',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (64,'منة فرج نادي','01014568554','1',NULL,2,'فيوم',NULL,'2026-06-26 14:36:40',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (65,'ياسمين كارم احمد','01069056447','1',NULL,2,'فيوم',NULL,'2026-06-26 14:38:05',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (66,'هدير وائل ابراهيم','01070678740','2',NULL,2,'فيوم',NULL,'2026-06-26 14:39:12',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (67,'حبيبة عماد سعيد','01018323887','1',NULL,2,'فيوم',NULL,'2026-06-26 14:42:03',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (68,'جني خالد محمد سعد','01110156022','1',NULL,2,'فيوم',NULL,'2026-06-26 14:43:08',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (69,'ملك محمد صادق','01091910617','1',NULL,2,'فيوم',NULL,'2026-06-26 14:44:19',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (70,'الاء عمرو فتحي','01016606786','1',NULL,2,'فيوم',NULL,'2026-06-26 14:45:24',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (71,'جني خالد سيد','01000365166','1',NULL,2,'فيوم',NULL,'2026-06-26 14:46:33',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (72,'ملك محمد عبدالله','01029938912','1',NULL,2,'فيوم',NULL,'2026-06-26 14:47:58',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (73,'شادي عصام محمد','01035835829','1',NULL,1,'فيوم',NULL,'2026-06-26 14:49:12',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (74,'زياد عشري احمد','01094241134','1',NULL,1,'فيوم',NULL,'2026-06-26 14:50:24',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (75,'سارة محمد محمود','01030226166','1',NULL,2,'فيوم',NULL,'2026-06-26 14:51:30',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (76,'عمرو خالد سيد','01015569879','2',NULL,1,'',NULL,'2026-06-26 14:54:25','2026-06-26 14:56:35',1,1,1,0);
INSERT INTO `oa_trainee` VALUES (77,'بسملة طه عبدالحميد','01154381017','1',NULL,2,'فيوم',NULL,'2026-06-26 14:55:52',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (78,'فاطمة مهدي محمد','01012950514','1',NULL,2,'فيوم',NULL,'2026-06-26 16:22:13',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (79,'مصطفي حمادة كمال','01095799456','1',NULL,1,'فيوم',NULL,'2026-06-26 16:27:17',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (80,'بسملة ايهاب فاروق','01013814997','1',NULL,2,'فيوم',NULL,'2026-06-26 16:28:18',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (81,'شروق وليد احمد','01092055314','1',NULL,2,'فيوم',NULL,'2026-06-26 16:29:34',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (82,'عمر عبدالناصر علي','01129312242','1',NULL,1,'فيوم',NULL,'2026-06-26 16:32:36',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (83,'دعاء فتحي عيد','01022937902','1',NULL,2,'فيوم',NULL,'2026-06-26 16:33:55',NULL,1,NULL,1,0);
INSERT INTO `oa_trainee` VALUES (84,'سلمي محمد عبدالرحيم','01098368914','1',NULL,2,'فيوم',NULL,'2026-06-26 16:35:24',NULL,1,NULL,1,0);
/*!40000 ALTER TABLE `oa_trainee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_trainee_attendance`
--

DROP TABLE IF EXISTS `oa_trainee_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_trainee_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainee_id` int NOT NULL,
  `course_session_id` int NOT NULL,
  `status` int NOT NULL,
  `attendance_date` date DEFAULT NULL,
  `late_time` int DEFAULT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `note` text,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int NOT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_trainee_attendance_created_by` (`created_by_id`),
  KEY `fk_trainee_attendance_modified_by` (`last_modified_by_id`),
  KEY `idx_attendance_trainee_date` (`trainee_id`,`attendance_date`),
  KEY `idx_attendance_session_status` (`course_session_id`,`status`),
  KEY `idx_attendance_date_status` (`attendance_date`,`status`),
  CONSTRAINT `fk_trainee_attendance_course_session` FOREIGN KEY (`course_session_id`) REFERENCES `oa_course_session` (`id`),
  CONSTRAINT `fk_trainee_attendance_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_trainee_attendance_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_trainee_attendance_trainee` FOREIGN KEY (`trainee_id`) REFERENCES `oa_trainee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_trainee_attendance`
--

LOCK TABLES `oa_trainee_attendance` WRITE;
/*!40000 ALTER TABLE `oa_trainee_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `oa_trainee_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_trainee_certificate`
--

DROP TABLE IF EXISTS `oa_trainee_certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_trainee_certificate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `certificate_number` varchar(100) DEFAULT NULL,
  `certificate_name` varchar(255) DEFAULT NULL,
  `trainee_id` int NOT NULL,
  `course_id` int DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `grade` varchar(50) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int DEFAULT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificate_number` (`certificate_number`),
  KEY `fk_certificate_trainee` (`trainee_id`),
  KEY `fk_certificate_course` (`course_id`),
  KEY `fk_certificate_created_by` (`created_by_id`),
  KEY `fk_certificate_modified_by` (`last_modified_by_id`),
  CONSTRAINT `fk_certificate_course` FOREIGN KEY (`course_id`) REFERENCES `oa_course` (`id`),
  CONSTRAINT `fk_certificate_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_certificate_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_certificate_trainee` FOREIGN KEY (`trainee_id`) REFERENCES `oa_trainee` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_trainee_certificate`
--

LOCK TABLES `oa_trainee_certificate` WRITE;
/*!40000 ALTER TABLE `oa_trainee_certificate` DISABLE KEYS */;
/*!40000 ALTER TABLE `oa_trainee_certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_trainee_contact`
--

DROP TABLE IF EXISTS `oa_trainee_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_trainee_contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trainee_id` int NOT NULL,
  `contact_type` int DEFAULT NULL,
  `contact_value` varchar(255) NOT NULL,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `created_by_id` int DEFAULT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_trainee_contact_trainee` (`trainee_id`),
  KEY `fk_trainee_contact_created_by` (`created_by_id`),
  KEY `fk_trainee_contact_modified_by` (`last_modified_by_id`),
  KEY `idx_trainee_contact_value` (`contact_value`),
  CONSTRAINT `fk_trainee_contact_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_trainee_contact_modified_by` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_trainee_contact_trainee` FOREIGN KEY (`trainee_id`) REFERENCES `oa_trainee` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_trainee_contact`
--

LOCK TABLES `oa_trainee_contact` WRITE;
/*!40000 ALTER TABLE `oa_trainee_contact` DISABLE KEYS */;
INSERT INTO `oa_trainee_contact` VALUES (3,5,2,'01103352843','2026-06-20 12:55:21',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (4,6,2,'01070678864',NULL,'2026-06-26 16:11:00',NULL,1,NULL);
INSERT INTO `oa_trainee_contact` VALUES (5,7,2,'01091151856','2026-06-20 13:00:55',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (6,8,2,'01065651980','2026-06-20 13:01:56',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (7,10,2,'01012941047','2026-06-20 13:03:19',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (8,13,2,'01101486785',NULL,'2026-06-26 14:53:44',NULL,1,NULL);
INSERT INTO `oa_trainee_contact` VALUES (9,14,2,'01061062904','2026-06-20 13:06:30',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (10,15,2,'01004583286','2026-06-20 13:08:04',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (11,16,2,'01030350853','2026-06-20 13:09:05',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (12,17,2,'01122751270','2026-06-20 13:09:57',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (13,18,2,'01122025584','2026-06-20 13:10:58',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (14,19,2,'01116378125','2026-06-20 13:11:53',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (15,20,2,'01104378235','2026-06-20 13:13:51',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (16,21,2,'01014906191','2026-06-20 13:14:47',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (17,22,2,'01096961309','2026-06-20 13:15:29',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (18,24,2,'01116237539','2026-06-20 15:23:12',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (19,25,2,'01030053716','2026-06-23 13:51:43',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (20,26,2,'01015094389','2026-06-23 15:14:49',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (21,27,2,'01068282945','2026-06-23 15:25:56',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (23,29,2,'01094207970','2026-06-23 15:37:02',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (24,30,2,'01289092076',NULL,'2026-06-23 20:07:12',NULL,1,NULL);
INSERT INTO `oa_trainee_contact` VALUES (25,31,2,'01000192354','2026-06-23 19:53:15',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (26,32,2,'01070511467','2026-06-23 20:02:33',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (27,33,2,'01025205684',NULL,'2026-06-23 20:06:48',NULL,1,NULL);
INSERT INTO `oa_trainee_contact` VALUES (28,34,2,'01010486106','2026-06-23 20:06:01',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (29,35,2,'01006985108','2026-06-25 19:33:25',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (30,36,2,'01011089239','2026-06-25 19:35:30',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (31,37,2,'01009910342','2026-06-25 19:37:36',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (32,38,2,'01008899582','2026-06-25 19:38:57',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (33,39,2,'01016082191','2026-06-25 19:40:40',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (34,40,2,'01115628605','2026-06-25 19:42:30',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (35,41,2,'01019027791','2026-06-25 19:44:02',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (36,42,2,'01120932927','2026-06-25 19:45:28',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (37,43,2,'01554404546','2026-06-25 19:47:45',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (38,44,2,'01554404546','2026-06-25 19:48:59',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (39,45,2,'01040784111','2026-06-25 19:52:38',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (40,46,2,'01128768344','2026-06-25 19:54:00',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (41,47,2,'01015057213','2026-06-25 19:55:14',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (42,48,3,'01068207762','2026-06-26 10:29:59',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (43,48,2,'01050708162','2026-06-26 10:29:59',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (44,49,2,'01092477242','2026-06-26 10:50:25',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (45,50,2,'01110898061','2026-06-26 10:52:02',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (46,51,2,'01123429207','2026-06-26 10:53:05',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (47,52,2,'01034112430','2026-06-26 10:54:29',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (48,53,2,'01120259008','2026-06-26 10:55:36',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (49,54,2,'01040602201','2026-06-26 10:56:45',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (50,55,2,'01050110592','2026-06-26 10:58:17',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (51,56,2,'01105838401','2026-06-26 10:59:30',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (52,57,2,'01095459576','2026-06-26 11:00:34',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (53,58,2,'0102866001','2026-06-26 11:02:12',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (54,59,2,'01092225851','2026-06-26 14:28:19',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (55,60,2,'01029088932','2026-06-26 14:30:34',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (56,61,2,'01140764808','2026-06-26 14:32:27',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (57,62,2,'01030842796','2026-06-26 14:34:02',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (58,63,2,'01019624043','2026-06-26 14:35:27',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (59,64,2,'01014568554','2026-06-26 14:36:40',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (60,65,2,'01069056447','2026-06-26 14:38:05',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (61,66,2,'01070678740','2026-06-26 14:39:12',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (62,67,2,'01018323887','2026-06-26 14:42:03',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (63,68,2,'01110156022','2026-06-26 14:43:08',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (64,69,2,'01091910617','2026-06-26 14:44:19',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (65,70,2,'01016606786','2026-06-26 14:45:24',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (66,71,2,'01000365166','2026-06-26 14:46:33',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (67,72,2,'01029938912','2026-06-26 14:47:58',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (68,73,2,'01035835829','2026-06-26 14:49:12',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (69,74,2,'01094241134','2026-06-26 14:50:24',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (70,75,2,'01030226166','2026-06-26 14:51:30',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (71,76,2,'01015569879',NULL,'2026-06-26 14:56:35',NULL,1,NULL);
INSERT INTO `oa_trainee_contact` VALUES (72,77,2,'01154381017','2026-06-26 14:55:52',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (73,78,2,'01012950514','2026-06-26 16:22:13',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (74,79,2,'01095799456','2026-06-26 16:27:17',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (75,80,2,'01013814997','2026-06-26 16:28:18',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (76,81,2,'01092055314','2026-06-26 16:29:34',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (77,82,2,'01129312242','2026-06-26 16:32:36',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (78,83,2,'01022937902','2026-06-26 16:33:55',NULL,1,NULL,0);
INSERT INTO `oa_trainee_contact` VALUES (79,84,2,'01098368914','2026-06-26 16:35:24',NULL,1,NULL,0);
/*!40000 ALTER TABLE `oa_trainee_contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_trainer_course`
--

DROP TABLE IF EXISTS `oa_trainer_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_trainer_course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `course_id` int NOT NULL,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_id` int DEFAULT NULL,
  `is_deleted` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_trainer_course_course` (`course_id`),
  KEY `fk_trainer_course_created_by` (`created_by_id`),
  KEY `idx_trainer_course_employee_course` (`employee_id`,`course_id`),
  CONSTRAINT `fk_trainer_course_course` FOREIGN KEY (`course_id`) REFERENCES `oa_course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_trainer_course_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_trainer_course_employee` FOREIGN KEY (`employee_id`) REFERENCES `oa_employee` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_trainer_course`
--

LOCK TABLES `oa_trainer_course` WRITE;
/*!40000 ALTER TABLE `oa_trainer_course` DISABLE KEYS */;
/*!40000 ALTER TABLE `oa_trainer_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_trainer_course_session`
--

DROP TABLE IF EXISTS `oa_trainer_course_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_trainer_course_session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `course_session_id` int NOT NULL,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_trainer_course_session_employee` (`employee_id`),
  KEY `fk_trainer_course_session_created_by` (`created_by_id`),
  CONSTRAINT `fk_trainer_course_session_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_trainer_course_session_employee` FOREIGN KEY (`employee_id`) REFERENCES `oa_employee` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_trainer_course_session`
--

LOCK TABLES `oa_trainer_course_session` WRITE;
/*!40000 ALTER TABLE `oa_trainer_course_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `oa_trainer_course_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oa_user`
--

DROP TABLE IF EXISTS `oa_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oa_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `is_active` tinyint DEFAULT NULL,
  `created_by_id` int DEFAULT NULL,
  `last_modified_by_id` int DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_created_by` (`created_by_id`),
  KEY `fk_user_last_modified_by_id` (`last_modified_by_id`),
  CONSTRAINT `fk_user_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `oa_user` (`id`),
  CONSTRAINT `fk_user_last_modified_by_id` FOREIGN KEY (`last_modified_by_id`) REFERENCES `oa_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oa_user`
--

LOCK TABLES `oa_user` WRITE;
/*!40000 ALTER TABLE `oa_user` DISABLE KEYS */;
INSERT INTO `oa_user` VALUES (1,'mohamedehab12080@gmail.com','$2a$10$Qmi3QjMYrocbAN86BBBZXeFViZIpbKE7wV8fXKWAjwh6ZDepoLsza','Mohamed Ehab','+201234567890','ROLE_SUPER_ADMIN',1,NULL,NULL,'2026-06-19 09:58:14',NULL);
INSERT INTO `oa_user` VALUES (2,'m.ehab.rabea@gmail.com','$2a$10$aMl.qo7zYiEWGuduZ.pB/Op39NGJx0SBNdP0VauF9CxD7wIR27qqq','Mohamed Ehab Rabea','+201234567891','ROLE_ADMIN',1,NULL,NULL,'2026-06-19 09:58:14',NULL);
INSERT INTO `oa_user` VALUES (3,'demo@travelplanner.com','$2a$10$ANp2SAjWIH4QvXD.OBpLmukYLp98XHL6sp4hSOVtanYFNOYdj.T0G','Demo User','+201234567892','ROLE_USER',1,NULL,NULL,'2026-06-19 09:58:14',NULL);
/*!40000 ALTER TABLE `oa_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sc_domain`
--

DROP TABLE IF EXISTS `sc_domain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sc_domain` (
  `id` int NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `event_data_class_name` varchar(500) DEFAULT NULL,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `last_modified_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sc_domain`
--

LOCK TABLES `sc_domain` WRITE;
/*!40000 ALTER TABLE `sc_domain` DISABLE KEYS */;
INSERT INTO `sc_domain` VALUES (4002,'Employee','موظف',NULL,NULL,NULL);
INSERT INTO `sc_domain` VALUES (5002,'Trainee','Trainee',NULL,NULL,NULL);
INSERT INTO `sc_domain` VALUES (5003,'Trainee Certificate','شهادات المتدربين',NULL,NULL,NULL);
/*!40000 ALTER TABLE `sc_domain` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sc_event`
--

DROP TABLE IF EXISTS `sc_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sc_event` (
  `id` int NOT NULL,
  `domain_id` int NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `last_modified_on` timestamp NULL DEFAULT NULL,
  `last_modified_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sc_event_sc_domain` (`domain_id`),
  CONSTRAINT `fk_sc_event_sc_domain` FOREIGN KEY (`domain_id`) REFERENCES `sc_domain` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sc_event`
--

LOCK TABLES `sc_event` WRITE;
/*!40000 ALTER TABLE `sc_event` DISABLE KEYS */;
/*!40000 ALTER TABLE `sc_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'olympic_academy_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-17 15:05:22
