const db = require("../models");
const Tutorial = db.tutorials;

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

// Создать и сохранить запись 
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Содержимое не может быть пустым!" });
    return;
  }

  // Создание записи в таблице
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image
  });

  // Сохранить данные в базу данных
  tutorial
    .save(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Произошла ошибка при создании записи.",
      });
    });
};

// Вывести все записи из базы данных
exports.findAll = (req, res) => {
  const { page, size, title } = req.query;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  const { limit, offset } = getPagination(page, size);

  Tutorial.paginate(condition, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        tutorials: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Произошла ошибка при создании записи.",
      });
    });
};

// Найти одну единственную запись
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Не найдено записи с таким id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ошибка с выводом записи с уникальным номером = " + id });
    });
};

// Обновить запись в базе данных
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Данные не могут быть пустыми!",
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Не возможно обновить запись с уникальным номером=${id}. Возможно запись не найдена!`,
        });
      } else res.send({ message: "Запись обновлена успешно." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Ошибка с обновлением записи = " + id,
      });
    });
};

// Удаление записи с уникальным номером
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Не возможно удалить запись с уникальным номером=${id}. Возможно запись не найдена!`,
        });
      } else {
        res.send({
          message: "Запись удалена успешно!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Не возможно удалить запись с уникальным номером=" + id,
      });
    });
};

// Удалить все записи из базы данных
exports.deleteAll = (req, res) => {
  Tutorial.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Записи удалены успешно!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Возникли некоторые проблемы с удалением записей.",
      });
    });
};

// Найти все опубликованные записи
exports.findAllPublished = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Tutorial.paginate({ published: true }, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        tutorials: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Возникли некоторые проблемы с удалением записей.",
      });
    });
};