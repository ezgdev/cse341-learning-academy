// __tests__/studentController.test.js
const { getAll, getById } = require('../controllers/courseController');
const mongodb = require('../data/database'); // Esto se va a mockear
const { ObjectId } = require('mongodb');

jest.mock('../data/database'); // Mockea el módulo que accede a la DB

describe('Course Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getAllCourses', () => {
    it('should return all courses with status 200', async () => {
      const mockCourses = [
        {
          _id: new ObjectId("688e683187ad9fdbfc7677a3"),
          title: "any",
          description: "test4",
          level: "any",
          durationWeeks: "7",
          instructorId: "68882f9b81a46581d5d8b762"
        }
      ];

      // Simular el comportamiento de mongodb.getDb().db().collection().find().toArray()
      const mockCursor = { toArray: jest.fn().mockResolvedValue(mockCourses) };
      const mockCollection = { find: jest.fn().mockReturnValue(mockCursor) };
      const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
      mongodb.getDb.mockReturnValue({ db: () => mockDb });

      await getAll(req, res);

      expect(mongodb.getDb).toHaveBeenCalled();
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCourses);
    });
  });

  describe('getCourseById', () => {
    it('should return course if found', async () => {
      const courseId = new ObjectId("68882fe181a46581d5d8b767");
      req.params.id = courseId.toString();
      const mockCourse = [{
         _id: courseId,
         title: "any",
         description: "test4",
         level: "any",
         durationWeeks: "7",
         instructorId: "68882f9b81a46581d5d8b762"
      }];


      // Mock the findOne method to return a single document
      const mockCollection = { findOne: jest.fn().mockResolvedValue(mockCourse) };
      const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
      mongodb.getDb.mockReturnValue({ db: () => mockDb });

      await getById(req, res);

      expect(mongodb.getDb).toHaveBeenCalled();
      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: new ObjectId(req.params.id) });
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCourse);
    });

    it('should return 404 if course not found', async () => {
      const courseId = new ObjectId();
      req.params.id = courseId.toString();

      // Mock the findOne method to return null
      const mockCollection = { findOne: jest.fn().mockResolvedValue(null) };
      const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
      mongodb.getDb.mockReturnValue({ db: () => mockDb });

      await getById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Course not found' });
    });

  });
});
