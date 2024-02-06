import { ItemModel } from "../models/Item.js";

const ItemController = {
  // GET /items/:id
  getItemById: async (req, res) => {
    try {
      const itemId = req.params.id;
      const item = await ItemModel.findById(itemId);

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      return res.json(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // POST /items
  createItem: async (req, res) => {
    try {
      const itemData = req.body;

      const newItem = new ItemModel({
        name: itemData.name,
      });

      // Save the new item to the database
      await newItem.save();

      return res.status(201).json(newItem);
    } catch (error) {
      console.error("Error creating item:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // PUT /items/:id
  updateItem: async (req, res) => {
    try {
      const itemId = req.params.id;
      const itemData = req.body;

      const updatedItem = await ItemModel.findByIdAndUpdate(itemId, itemData, {
        new: true,
      });
 
      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      return res.json(updatedItem);
    } catch (error) {
      console.error("Error updating item:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // DELETE /items/:id
  deleteItem: async (req, res) => {
    try {
      const itemId = req.params.id;
      const deletedItem = await ItemModel.findByIdAndDelete(itemId);
      if (!deletedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      return res.json(deletedItem);
    } catch (error) {
      console.error("Error deleting item:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default ItemController;
